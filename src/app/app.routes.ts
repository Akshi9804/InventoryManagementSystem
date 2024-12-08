import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { TaskComponent } from './components/task/task.component';
import { InventoryComponent } from './components/inventory/inventory.component';
import { OrdersComponent } from './components/orders/orders.component';
import { SuppliersComponent } from './components/suppliers/suppliers.component';
import { AddSupplierComponent } from './components/add-supplier/add-supplier.component';
import { ViewSuppliersComponent } from './components/view-suppliers/view-suppliers.component';
import { SupplierComponent } from './components/supplier/supplier.component';
import { AddExistingItemComponent } from './components/add-existing-item/add-existing-item.component';
import { ItemComponent } from './components/item/item.component';
import { PurchaseOrderComponent } from './components/purchase-order/purchase-order.component';
import { LogsComponent } from './components/logs/logs.component';
import { LocationsComponent } from './components/locations/locations.component';
import { LocationDetailsComponent } from './components/location-details/location-details.component';
import { AddExistingItemLocationComponent } from './components/add-existing-item-location/add-existing-item-location.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ManageLocationsComponent } from './components/manage-locations/manage-locations.component';
import { StockTransferLogsComponent } from './components/stock-transfer-logs/stock-transfer-logs.component';
import { TransferStockComponent } from './components/transfer-stock/transfer-stock.component';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import { authGuard } from './guards/auth.guard';
import { authAdminGuard } from './guards/auth-admin.guard';
import { UsersComponent } from './components/users/users.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'task', component: TaskComponent,canActivate: [authGuard],
        children: [
          {
            path: '',
            component: DashboardComponent
          },
            {
              path: 'inventory',
              component: InventoryComponent
            },
            {path:"inventory/:itemId",component:ItemComponent},
            {
              path: 'orders',
              component: OrdersComponent,
            },
            {
                path: 'suppliers',
                component: SuppliersComponent,
                children: [
                    {path:"",component:ViewSuppliersComponent},
                    { path: 'add', component: AddSupplierComponent,canActivate: [authAdminGuard] } ,
                    { path: ':supplierId', component: SupplierComponent }
                  ]
            },
            { path: 'suppliers/:supplierId/add-item',canActivate: [authAdminGuard], component: AddExistingItemComponent },
            {
              path: 'purchase-order',
              component: PurchaseOrderComponent,
              canActivate: [authAdminGuard]
            },
            {
              path: 'logs',
              component: LogsComponent,
              canActivate: [authAdminGuard]
            },
            {
              path: 'location',
              component: ManageLocationsComponent,
              children:[
                { path: '', component: LocationsComponent },
                { path: 'stock-transfer', component: TransferStockComponent ,canActivate: [authAdminGuard]},
                { path: 'stock-transfer-logs', component: StockTransferLogsComponent ,canActivate: [authAdminGuard]},
                { path: ':locId', component: LocationDetailsComponent },
                { path: ':locId/add-existing-item-location', component: AddExistingItemLocationComponent ,canActivate: [authAdminGuard]},
              ]
            },{
              path: 'users',
              component: UsersComponent,
              canActivate: [authAdminGuard]
            }
            
          ]
    },
    {
      path: 'unauthorized',
      component: UnauthorizedComponent
    },
    { path: '**', redirectTo: '/' }
];
