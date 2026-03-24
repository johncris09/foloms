<?php
defined('BASEPATH') or exit('No direct script access allowed');



$route['default_controller'] = 'welcome';
$route['404_override'] = '';
$route['translate_uri_dashes'] = FALSE;



// User
$route['user'] = 'User';
$route['login'] = 'User/login';
$route['user/find/(:any)'] = 'User/find/$1';
$route['user/update_login_status'] = 'User/update_login_status';
$route['user/update/(:any)'] = 'User/update/$1';
$route['user/delete/(:any)'] = 'User/delete/$1';

// Driver
$route['driver'] = 'Driver';
$route['driver/insert'] = 'Driver/insert';
$route['driver/find/(:any)'] = 'Driver/find/$1';
$route['driver/top_consumption'] = 'Driver/top_consumption';
$route['driver/update/(:any)'] = 'Driver/update/$1';
$route['driver/delete/(:any)'] = 'Driver/delete/$1';
$route['driver/get_driver_latest_transaction'] = 'Driver/get_driver_latest_transaction';



// Office
$route['office'] = 'Office';
$route['office/insert'] = 'Office/insert';
$route['office/find/(:any)'] = 'Office/find/$1';
$route['office/top_consumption'] = 'Office/top_consumption';
$route['office/update/(:any)'] = 'Office/update/$1';
$route['office/delete/(:any)'] = 'Office/delete/$1';


// Supplier
$route['supplier'] = 'Supplier';
$route['supplier/insert'] = 'Supplier/insert';
$route['supplier/find/(:any)'] = 'Supplier/find/$1';
$route['supplier/top_consumption'] = 'Supplier/top_consumption';
$route['supplier/update/(:any)'] = 'Supplier/update/$1';
$route['supplier/delete/(:any)'] = 'Supplier/delete/$1';

// Transaction
$route['transaction'] = 'Transaction';
$route['transaction/remaining_balance'] = 'Transaction/remaining_balance';
$route['transaction/total_delivery'] = 'Transaction/total_delivery';
$route['transaction/filter'] = 'Transaction/filter';
$route['transaction/get_transaction'] = 'Transaction/get_transaction';

// Delivery
$route['delivery'] = 'Delivery';
$route['delivery/insert'] = 'Delivery/insert';
$route['delivery/find/(:any)'] = 'Delivery/find/$1';
$route['delivery/top_consumption'] = 'Delivery/top_consumption';
$route['delivery/update/(:any)'] = 'Delivery/update/$1';
$route['delivery/delete/(:any)'] = 'Delivery/delete/$1';
$route['delivery/get_previous_next_delivery'] = 'Delivery/get_previous_next_delivery';
$route['delivery/update_trip_ticket_unit_cost_by_previous_next_delivery'] = 'Delivery/update_trip_ticket_unit_cost_by_previous_next_delivery';


// Product
$route['product'] = 'Product';
$route['product/insert'] = 'Product/insert';
$route['product/find/(:any)'] = 'Product/find/$1';
$route['product/total_consumption'] = 'Product/total_consumption';
$route['product/update/(:any)'] = 'Product/update/$1';
$route['product/delete/(:any)'] = 'Product/delete/$1';

// Equipment
$route['equipment'] = 'Equipment';
$route['equipment/insert'] = 'Equipment/insert';
$route['equipment/find/(:any)'] = 'Equipment/find/$1';
$route['equipment/monthly_report'] = 'Equipment/monthly_report';
$route['equipment/top_consumption'] = 'Equipment/top_consumption';
$route['equipment/update/(:any)'] = 'Equipment/update/$1';
$route['equipment/delete/(:any)'] = 'Equipment/delete/$1';


// Trip Ticket
$route['trip_ticket'] = 'TripTicket';
$route['trip_ticket/insert'] = 'TripTicket/insert';
$route['trip_ticket/filter'] = 'TripTicket/filter';
$route['trip_ticket/find/(:any)'] = 'TripTicket/find/$1';
$route['trip_ticket/product_consumption_trend'] = 'TripTicket/product_consumption_trend';
$route['trip_ticket/filter_product_consumption_trend'] = 'TripTicket/filter_product_consumption_trend';
$route['trip_ticket/update/(:any)'] = 'TripTicket/update/$1';
$route['trip_ticket/delete/(:any)'] = 'TripTicket/delete/$1';
$route['trip_ticket/work_trend'] = 'TripTicket/work_trend';


// Old Trip Ticket
$route['old_trip_ticket'] = 'OldTripTicket';
$route['old_trip_ticket/insert'] = 'OldTripTicket/insert';
$route['old_trip_ticket/filter'] = 'OldTripTicket/filter';
$route['old_trip_ticket/find/(:any)'] = 'OldTripTicket/find/$1';
$route['old_trip_ticket/update/(:any)'] = 'OldTripTicket/update/$1';
$route['old_trip_ticket/delete/(:any)'] = 'OldTripTicket/delete/$1';
$route['old_trip_ticket/work_trend'] = 'OldTripTicket/work_trend';
// report
$route['old_trip_ticket/monthly_report_filter'] = 'OldTripTicket/monthly_report_filter';
$route['old_trip_ticket/transaction_filter'] = 'OldTripTicket/transaction_filter';
$route['old_trip_ticket/fuel_pump_dispense_filter'] = 'OldTripTicket/fuel_pump_dispense_filter';



// Fuel Pump Dispense
$route['fuel_pump_dispense'] = 'FuelPumpDispense';
$route['fuel_pump_dispense/filter'] = 'FuelPumpDispense/filter';

// Monthly Report
$route['monthly_report/filter'] = 'MonthlyReport/filter';


// Control Number
$route['control_number'] = 'ControlNumber';
$route['last_control_number'] = 'ControlNumber/last';
$route['control_number/update/(:any)'] = 'ControlNumber/update/$1';

// Equipment Type
$route['equipment_type'] = 'EquipmentType';
$route['equipment_type/insert'] = 'EquipmentType/insert';
$route['equipment_type/find/(:any)'] = 'EquipmentType/find/$1';
$route['equipment_type/update/(:any)'] = 'EquipmentType/update/$1';
$route['equipment_type/delete/(:any)'] = 'EquipmentType/delete/$1';


// Report Type
$route['report_type'] = 'ReportType';
$route['report_type/insert'] = 'ReportType/insert';
$route['report_type/find/(:any)'] = 'ReportType/find/$1';
$route['report_type/update/(:any)'] = 'ReportType/update/$1';
$route['report_type/delete/(:any)'] = 'ReportType/delete/$1';


// Equipment Type
$route['vehicle_consumption'] = 'VehicleConsumption';
