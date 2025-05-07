# MediTrack_frontend

## Project Overview:
Create a full-stack web application for hospital staff to manage medical devices, work
orders (CM and PPM), spare parts requests, and annual inventory checks. The system
must have user roles (Nurse, Engineer, Admin) with different permissions based on the
role.

## Frontend Routing (React Router)

| Path                   | Component/Page             | Description                                         | Access Control      |
| :--------------------- | :------------------------- | :-------------------------------------------------- | :------------------ |
| `/login`               | `LoginPage`                | User login form                                     | Public              |
| `/signup`              | `SignupPage`               | User registration form                              | Public              |
| `/`                    | `Dashboard` / Redirector   | Main dashboard after login, redirects based on role | Authenticated       |
| `/devices`             | `DeviceListPage`           | Display list of devices (view depends on role)      | Authenticated       |
| `/devices/new`         | `DeviceCreatePage`         | Form to create a new device                         | Admin               |
| `/devices/:id`         | `DeviceDetailPage`         | Display details of a specific device                | Authenticated       |
| `/devices/:id/edit`    | `DeviceEditPage`           | Form to edit a specific device                      | Admin, Engineer     |
| `/devices/:id/inventory`| `DeviceInventoryPage`      | Form to update device location during inventory     | Engineer            |
| `/workorders`          | `WorkOrderListPage`        | Display list of work orders (view depends on role)  | Authenticated       |
| `/workorders/new`      | `WorkOrderCreatePage`      | Form to create a new work order                     | Engineer, Nurse     |
| `/workorders/:id`      | `WorkOrderDetailPage`      | Display details of a specific work order            | Authenticated       |
| `/workorders/:id/edit` | `WorkOrderEditPage`        | Form to update work order status, etc.              | Admin, Engineer, Nurse |
| `/spareparts`          | `SparePartListPage`        | Display list of spare part requests                 | Admin, Engineer     |
| `/spareparts/new`      | `SparePartCreatePage`      | Form to create a new spare part request             | Engineer            |
| `/spareparts/:id`      | `SparePartDetailPage`      | Display details of a specific spare part request    | Admin, Engineer     |
| `/profile`             | `ProfilePage`              | View/edit user profile                              | Authenticated       |
| `/admin/users`         | `UserManagementPage`       | (Optional) Manage users                             | Admin               |
| `/*`                   | `NotFoundPage`             | Displayed for any undefined routes                  | Public              |
