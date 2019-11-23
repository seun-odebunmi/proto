import { Routes, RouterModule } from '@angular/router'
import { ModuleWithProviders } from '@angular/core'
import { PagesComponent } from './pages.component'
import { BlankComponent } from './blank/blank.component'
import { SearchComponent } from './search/search.component'
import { AuthGuard } from '../auth.guard'

export const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadChildren: 'app/pages/dashboard/dashboard.module#DashboardModule',
        data: { breadcrumb: 'Dashboard' },
        canActivate: [AuthGuard]
      },
      {
        path: 'blank',
        component: BlankComponent,
        data: { breadcrumb: 'Blank page' }
      },
      {
        path: 'search',
        component: SearchComponent,
        data: { breadcrumb: 'Search' }
      },
      {
        path: 'profile',
        loadChildren: 'app/pages/profile/profile.module#ProfileModule',
        data: { breadcrumb: 'Profile' },
        canActivate: [AuthGuard]
      },
      {
        path: 'appVersion',
        loadChildren:
          'app/pages/app-version/app-version.module#AppVersionModule',
        data: { breadcrumb: 'App Version' },
        canActivate: [AuthGuard]
      },
      {
        path: 'change-password',
        loadChildren:
          'app/pages/change-password/change-password.module#ChangePasswordModule',
        data: { breadcrumb: 'Change Password' },
        canActivate: [AuthGuard]
      },
      {
        path: 'customer',
        loadChildren: 'app/pages/customers/customers.module#CustomerModule',
        data: { breadcrumb: 'Customers' },
        canActivate: [AuthGuard]
      },
      {
        path: 'set-customer-pin',
        loadChildren:
          'app/pages/set-customer-pin/set-customer-pin.module#SetCustomerPinModule',
        data: { breadcrumb: 'Set Customer Pin' },
        canActivate: [AuthGuard]
      },
      {
        path: 'serviceRequest',
        loadChildren:
          'app/pages/service-request/service-request.module#ServiceRequestModule',
        data: { breadcrumb: 'Service Request' },
        canActivate: [AuthGuard]
      },
      {
        path: 'customer/inbranch/enrollment',
        loadChildren:
          'app/pages/inbranch-enrollment/inbranch-enrollment.module#InbranchEnrollmentModule',
        data: { breadcrumb: 'Inbranch Enrollment' },
        canActivate: [AuthGuard]
      },
      {
        path: 'customer/password/reset',
        loadChildren:
          'app/pages/password-reset/password-reset.module#PasswordResetModule',
        data: { breadcrumb: 'Initiate Password Reset' },
        canActivate: [AuthGuard]
      },
      {
        path: 'customer/pin/reset',
        loadChildren: 'app/pages/pin-reset/pin-reset.module#PinResetModule',
        data: { breadcrumb: 'Initiate PIN Reset' },
        canActivate: [AuthGuard]
      },
      {
        path: 'customer/security-question/reset',
        loadChildren:
          'app/pages/security-question-reset/security-question-reset.module#SecurityQuestionResetModule',
        data: { breadcrumb: 'Initiate Security Question Reset' },
        canActivate: [AuthGuard]
      },
      {
        path: 'device',
        loadChildren: 'app/pages/devices/devices.module#DeviceModule',
        data: { breadcrumb: 'Devices' },
        canActivate: [AuthGuard]
      },
      {
        path: 'request/pending',
        loadChildren:
          'app/pages/pending-requests/pending-requests.module#PendingRequestModule',
        data: { breadcrumb: 'Pending Requests' },
        canActivate: [AuthGuard]
      },
      {
        path: 'limit/customer-limit',
        loadChildren:
          'app/pages/customer-limits/customer-limits.module#CustomerLimitModule',
        data: { breadcrumb: 'Customer Limits' },
        canActivate: [AuthGuard]
      },
      {
        path: 'limit/global-limit',
        loadChildren:
          'app/pages/global-limits/global-limits.module#GlobalLimitModule',
        data: { breadcrumb: 'Global Limits' },
        canActivate: [AuthGuard]
      },
      {
        path: 'limit/global-auth-limit',
        loadChildren:
          'app/pages/global-auth-limits/global-auth-limits.module#GlobalAuthLimitModule',
        data: { breadcrumb: 'Global Authentication Limits' },
        canActivate: [AuthGuard]
      },
      {
        path: 'transactions',
        loadChildren:
          'app/pages/transactions/transactions.module#TransactionModule',
        data: { breadcrumb: 'Transactions' },
        canActivate: [AuthGuard]
      },
      {
        path: 'admin/role-functions',
        loadChildren:
          'app/pages/role-functions/role-functions.module#RoleFunctionModule',
        data: { breadcrumb: 'Admin Role Functions' },
        canActivate: [AuthGuard]
      },
      {
        path: 'admin/countries',
        loadChildren: 'app/pages/countries/countries.module#CountryModule',
        data: { breadcrumb: 'Admin countries' },
        canActivate: [AuthGuard]
      },
      {
        path: 'admin/institutions',
        loadChildren:
          'app/pages/institutions/institutions.module#InstitutionModule',
        data: { breadcrumb: 'Admin institutions' },
        canActivate: [AuthGuard]
      },
      {
        path: 'admin/roles',
        loadChildren: 'app/pages/roles/roles.module#RoleModule',
        data: { breadcrumb: 'Admin Roles' },
        canActivate: [AuthGuard]
      },
      {
        path: 'admin/users',
        loadChildren: 'app/pages/users/users.module#UserModule',
        data: { breadcrumb: 'Admin Users' },
        canActivate: [AuthGuard]
      },
      {
        path: 'admin/branches',
        loadChildren: 'app/pages/branches/branches.module#BranchModule',
        data: { breadcrumb: 'Admin Branches' },
        canActivate: [AuthGuard]
      },
      {
        path: 'admin/activities',
        loadChildren: 'app/pages/activities/activities.module#ActivityModule',
        data: { breadcrumb: 'Activities' },
        canActivate: [AuthGuard]
      },
      {
        path: 'admin/audit/report',
        loadChildren: 'app/pages/audit-logs/audit-logs.module#AuditLogModule',
        data: { breadcrumb: 'Audit Reports' },
        canActivate: [AuthGuard]
      },
      {
        path: 'admin/portal/password-policy',
        loadChildren:
          'app/pages/portal-password-policy/portal-password-policy.module#PortalPasswordPolicyModule',
        data: { breadcrumb: 'Portal Password Policy' },
        canActivate: [AuthGuard]
      },
      {
        path: 'admin/app/password-policy',
        loadChildren:
          'app/pages/app-password-policy/app-password-policy.module#AppPasswordPolicyModule',
        data: { breadcrumb: 'Mobile App Password Policy' },
        canActivate: [AuthGuard]
      },
      {
        path: 'system/bank',
        loadChildren: 'app/pages/banks/banks.module#BankModule',
        data: { breadcrumb: 'Banks' },
        canActivate: [AuthGuard]
      },
      {
        path: 'system/category',
        loadChildren: 'app/pages/categories/categories.module#CategoryModule',
        data: { breadcrumb: 'Biller Category' },
        canActivate: [AuthGuard]
      },
      {
        path: 'system/biller',
        loadChildren: 'app/pages/billers/billers.module#BillerModule',
        data: { breadcrumb: 'Billers' },
        canActivate: [AuthGuard]
      },
      {
        path: 'system/product',
        loadChildren: 'app/pages/products/products.module#ProductModule',
        data: { breadcrumb: 'Products' },
        canActivate: [AuthGuard]
      }
    ]
  }
]

export const routing: ModuleWithProviders = RouterModule.forChild(routes)
