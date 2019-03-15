# cfdasa
Container for Deployment and Scaling Apps

## Enabling Autoscaling on DigitalOcean

## Installing Metrics Server

### Clone metrics-server repository
`git clone https://github.com/kubernetes-incubator/metrics-server.git`

### Update metrics-server pod
Edit `metrics-server/deploy/1.8+/metrics-server-deployment.yaml`. 
Under `containers:` look for the image `k8s.gcr.io/metrics-server-amd64:vx.x.x` where 
`x.x.x` is the version number. Add the following lines

```yaml
containers:
- image: k8s.gcr.io/metrics-server-amd64.vx.x.x
  command:
  - /metrics-server
  - --kubelet-insecure-tls
  - --kubelet-preferred-address-types=InternalIP
  - --logtostderr
```

Save and exit

Ref [SO: Unable to get pod metrics to use in horizontal pod autoscaling -Kubernetes](https://stackoverflow.com/questions/53538012/unable-to-get-pod-metrics-to-use-in-horizontal-pod-autoscaling-kubernetes)

### Install metrics-server
`cd metrics-server/deploy`

`kubectl apply -f 1.8+`

Verify that metrics-server is deploy with the following

`kubectl get svc/metrics-server -n kube-system`

## Installing Grafana, Prometheus and Heapster (deprecating :-))
### Download the following YAML files
`curl https://raw.githubusercontent.com/kubernetes/heapster/master/deploy/kube-config/influxdb/grafana.yaml > grafana.yaml`

`curl https://raw.githubusercontent.com/kubernetes/heapster/master/deploy/kube-config/influxdb/heapster.yaml > heapster.yaml`

`curl https://raw.githubusercontent.com/kubernetes/heapster/master/deploy/kube-config/influxdb/influxdb.yaml > influxdb.yaml`

`curl https://raw.githubusercontent.com/kubernetes/heapster/master/deploy/kube-config/rbac/heapster-rbac.yaml > heapster-rbac.yaml`

### Create the resources in the specified order 
`kubectl create -f grafana.yaml`

`kubectl create -f heapster.yaml`

`kubectl create -f influxdb.yaml`

`kubectl create -f heapster-rbac.yaml`

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
