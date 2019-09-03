# CFDSA - Container for Deployment and Scaling Apps

## Enabling Autoscaling on DigitalOcean

## Installing Metrics Server

### Clone metrics-server repository
`git clone https://github.com/kubernetes-incubator/metrics-server.git`

### Update metrics-server pod
Edit `metrics-server/deploy/1.8+/metrics-server-deployment.yaml`. 
Under `containers:` look for the image `k8s.gcr.io/metrics-server-amd64:vx.x.x` where 
`x.x.x` is the version number. Add the following lines

### Install metrics-server
`cd metrics-server/deploy`

Edit `1.8+/metrics-server-deployment.yaml`. Look for the following line:

`image: k8s.gcr.io/metrics-server-amd64:v0.3.1`

and perform the following edits

```yaml
containers:
 name: metrics-server
  image: k8s.gcr.io/metrics-server-amd64:vx.x.x
  imagePullPolicy: Always
 # add the lines below
  command:
  - /metrics-server
  - --kubelet-insecure-tls
  - --kubelet-preferred-address-types=InternalIP
  - --logtostderr
```

Ref [SO: Unable to get pod metrics to use in horizontal pod autoscaling -Kubernetes](https://stackoverflow.com/questions/53538012/unable-to-get-pod-metrics-to-use-in-horizontal-pod-autoscaling-kubernetes)

Install all the resources

`kubectl apply -f 1.8+`

Verify that metrics-server is deploy with the following

`kubectl get svc/metrics-server -n kube-system`

## Installing Grafana, Prometheus and Heapster (deprecating :-))
### Download the following YAML files
`curl https://raw.githubusercontent.com/kubernetes/heapster/master/deploy/kube-config/influxdb/grafana.yaml > grafana.yaml`

`curl https://raw.githubusercontent.com/kubernetes/heapster/master/deploy/kube-config/influxdb/heapster.yaml > heapster.yaml`

`curl https://raw.githubusercontent.com/kubernetes/heapster/master/deploy/kube-config/influxdb/influxdb.yaml > influxdb.yaml`

`curl https://raw.githubusercontent.com/kubernetes/heapster/master/deploy/kube-config/rbac/heapster-rbac.yaml > heapster-rbac.yaml`

### Update heapster.yaml

Edit `heapster.yaml`.  Look for the following line:

`image: k8s.gcr.io/heapster-amd64:vx.x.x`

and perform the following edits:

```
containers:
- name: heapster
  image: k8s.gcr.io/heapster-amd64:vx.x.x
  imagePullPolicy: IfNotPresent
  command:
  - /heapster
  # modify the above line to the one below
  - --source=kubernetes:https://kubernetes.default?useServiceAccount=true&kubeletHttps=true&kubeletPort=10250&insecure=true
  - --sink=influxdb:http://monitoring-influxdb.kube-system.svc:8086
```

### Create the resources in the specified order 
`kubectl apply -f influxdb.yaml`

`kubectl apply -f heapster-rbac.yaml`

`kubectl apply -f heapster.yaml`

`kubectl apply -f grafana.yaml`

### Verify that the resources have been create
`kubectl cluster-info`

Kubernetes master is running at https://XXX.k8s.ondigitalocean.com

Heapster is running at https://XXX.k8s.ondigitalocean.com/api/v1/namespaces/kube-system/services/heapster/proxy

CoreDNS is running at https://XXXX.k8s.ondigitalocean.com/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy

monitoring-grafana is running at https://XXXX.k8s.ondigitalocean.com/api/v1/namespaces/kube-system/services/monitoring-grafana/proxy

monitoring-influxdb is running at https://XXXX.k8s.ondigitalocean.com/api/v1/namespaces/kube-system/services/monitoring-influxdb/proxy

To further debug and diagnose cluster problems, use 'kubectl cluster-info dump'.

Reference from [Autoscale an application on Kubernetes Cluster](https://developer.ibm.com/tutorials/autoscale-application-on-kubernetes-cluster)

## Installing WebUI
	
WebUI in not installed by default. To install Kubernetes' WebUI, go to the [release page](https://github.com/kubernetes/dashboard/releases) and find the latest (or desired version). Find the latest release version and install according to the `kubectl` command stated in <strong>Installation</strong>. The command will look like the one shown below (for installing v2.0.0-beta4)

`kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v2.0.0-beta4/aio/deploy/recommended.yaml`

On a terminal, start a proxy server 

`kubectl proxy`

The WebUI can now be accessed with the following URL

[http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/](http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/)

![WebUI login](https://i.stack.imgur.com/7ZabE.png)

### Login to WebUI

Create a service account and give it the `cluster-admin` role (or you can create a role with limited privileges).

```yaml
apiVersion: v1
kind: ServiceAccount

metadata:
   name: webui-user
   namespace: kube-system

---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding

metadata:
   name: webui-user
   namespace: kube-system

roleRef:
   apiGroup: rbac.authorization.k8s.io
   kind: ClusterRole
   name: cluster-admin

subjects:
- kind: ServiceAccount
  name: webui-user
  namespace: kube-system

```

Create the service account `kubectl apply -f sa.yaml` assuming the file is called `sa.yaml`. 

Get the secret for the service account

`kubectl describe sa/webui-user -n kube-system`

Look for `Mountable secrets`. Copy the secret's name. 

`kubectl describe secret/secret_name_here -n kube-system`

Copy the token value and paste it into the 'Enter token' field.

## Installing Nginx Ingress Controller

Instead of having one load balancer per service (for services deployed with type as `LoadBalancer`), we can deploy our own load balancer which we can then configure it to route traffic to one or more services. The following is for DigitalOcean

Create the following 2 resources 

`kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/master/deploy/mandatory.yaml`

and 

`kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/master/deploy/provider/cloud-generic.yaml`

Verify that a load balancer is provisioned by running the following command

`kubectl get svc -n ingress-nginx`

```
NAME            TYPE           CLUSTER-IP     EXTERNAL-IP      PORT(S)                      AGE
ingress-nginx   LoadBalancer   10.245.17.17   157.230.196.98   80:30077/TCP,443:31512/TCP   21m
```

Note: `EXTERNAL-IP` will show an external IP address once the load balancer has been deployed. A `<pending>` indicates that the cloud provider is still provisioning the load balancer. You can verify the that the load balancer has indeed been provisioned by checking it in your cloud console.
