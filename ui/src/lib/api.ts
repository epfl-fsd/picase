import * as k3s from '@kubernetes/client-node';

const kc = new k3s.KubeConfig();

if (process.env.KUBERNETES_SERVICE_HOST) {
	kc.loadFromCluster();
} else {
	kc.loadFromDefault();
}

const k3sApi = kc.makeApiClient(k3s.CoreV1Api);
const appsApi = kc.makeApiClient(k3s.AppsV1Api);
const networkingApi = kc.makeApiClient(k3s.NetworkingV1Api);
const storageApi = kc.makeApiClient(k3s.StorageV1Api);
const customObjectsApi = kc.makeApiClient(k3s.CustomObjectsApi);
const coreV1Api = kc.makeApiClient(k3s.CoreV1Api);
const watchApi = new k3s.Watch(kc);

export { k3sApi, appsApi, networkingApi, storageApi, customObjectsApi, coreV1Api, watchApi };
