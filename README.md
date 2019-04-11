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
	
WebUI in not installed by default. To install Kubernetes' WebUI, go to the [release page](https://github.com/kubernetes/dashboard/releases) and find the latest (or desired version). At the time of writing, the latest version is version 1.10.1. Install with `kubectl apply` 

`kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v1.10.1/src/deploy/recommended/kubernetes-dashboard.yaml`

On a terminal, start a proxy server 

`kubectl proxy`

The WebUI can now be accessed with the following URL

[http://localhost:8001/api/v1/namespaces/kube-system/services/https:kubernetes-dashboard:/proxy/](http://localhost:8001/api/v1/namespaces/kube-system/services/https:kubernetes-dashboard:/proxy/)

![WebUI login](https://i.stack.imgur.com/7ZabE.png)


