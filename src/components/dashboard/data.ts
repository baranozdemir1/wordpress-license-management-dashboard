const columns = [
  { name: "ID", uid: "id", sortable: true },
  { name: "DOMAIN", uid: "domain" },
  { name: "NAME", uid: "name", sortable: true },
  { name: "LICENSE KEY", uid: "license_key" },
  { name: "STATUS", uid: "status", sortable: true },
  { name: "CREATED DATE", uid: "created_at", sortable: true },
  { name: "UPDATED DATE", uid: "updated_at", sortable: true },
  { name: "", uid: "actions" },
];

const statusOptions = [
  { name: "Active", uid: "active" },
  { name: "Paused", uid: "paused" },
];

export { columns, statusOptions };
