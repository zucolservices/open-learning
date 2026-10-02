# Sources (fact-checked 2026-10-02, before building)

Full notes: scratchpad `k8s/m12-facts.md` (raw pages in `k8s/m12/`).

- kubernetes.io, Volumes: "On-disk files in a container are ephemeral…"; emptyDir created when a Pod is assigned to a node and "deleted permanently" when it is removed, survives container crashes, medium: Memory; hostPath: "Using the hostPath volume type presents many security risks. If you can avoid using a hostPath volume, you should."; in-tree cloud plugins removed (AWS EBS and Azure Disk in 1.27, GCE PD in 1.28) in favour of CSI drivers. https://kubernetes.io/docs/concepts/storage/volumes/
- kubernetes.io, Persistent Volumes: PV and PVC, one-to-one binding, default StorageClass, reclaim policy Delete (default for dynamic) vs Retain, access modes RWO (can be shared by pods on the same node), ROX, RWX, RWOP (stable since 1.29); generic ephemeral volumes (GA 1.23).
- kubernetes.io, Storage Classes: volumeBindingMode Immediate (default) vs WaitForFirstConsumer for topology; allowVolumeExpansion (CSI expansion GA 1.24); VolumeSnapshots GA 1.20; VolumeAttributesClass GA 1.34.
- AWS: EBS volumes attach "to instances that are in the same Availability Zone only"; EBS CSI driver ebs.csi.aws.com; EFS for shared files. Google Cloud: PD CSI driver pd.csi.storage.gke.io with zone nodeAffinity; regional PD synchronously replicates between two zones; Filestore. Azure: Disk CSI driver disk.csi.azure.com; LRS within one data centre, ZRS across zones; Azure Files.
- The database, order count, node/zone layout and outcomes are an illustrative model of the documented behaviour.
