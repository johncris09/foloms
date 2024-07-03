<?php
defined('BASEPATH') or exit('No direct script access allowed');

require APPPATH . 'libraries/RestController.php';
require APPPATH . 'libraries/Format.php';

use chriskacerguis\RestServer\RestController;

class MonthlyReport extends RestController
{

	function __construct()
	{
		// Construct the parent class
		parent::__construct();
		$this->load->model('TripTicketModel');

	}
	public function index_get()
	{
		return true;
	}




	public function filter_get()
	{
		$tripTicketModel = new TripTicketModel;
		$requestData = $this->input->get();

		$date_range = array(
			'start_date' => date('Y-m-d', strtotime($requestData['start_date'])),
			'end_date' => date('Y-m-d', strtotime($requestData['end_date'])),
		);
		$data = [];
		// group by driver and equipment base on date range
		$driver_equipment = $tripTicketModel->get_driver_equipment($date_range);


		foreach ($driver_equipment as $row) {


			$trip_ticket = $tripTicketModel->get_driver_trip_ticket(
				[
					'driver_id' => $row->driver,
					'equipment_id' => $row->equipment,
					...$date_range
				]
			);
			$data[] = array(
							'plate_number' => $row->plate_number, 
							'model' => $row->model,
				'driver_full_name' => strtoupper( trim($row->last_name . ", " . $row->first_name . " " . $row->middle_name . " " . $row->suffix)),
				'trip_ticket' => $trip_ticket,
			);

			// foreach($trip_ticket as $trip_ticket_row){

			// 	$data[]['$trip_ticket'][] = $row;

			// }
		}

		// select all driver with in date range then
		// get the driver's trip ticket.


		// $drivers = $tripTicketModel->get_driver_within_date_range($date_range);

		// $data = [];
		// foreach ($drivers as $row) {

		// 	// get driver's equipment
		// 	$drivers_equipment = $tripTicketModel->get_driver_equipment(
		// 		['driver_id' => $row->driver_id, ...$date_range]
		// 	);
		// 	foreach ($drivers_equipment as $equipment) {

		// 		$trip_ticket = $tripTicketModel->get_driver_trip_ticket(
		// 			[
		// 				'driver_id' => $row->driver_id,
		// 				'equipment_id' => $equipment->equipment,
		// 				...$date_range
		// 			]
		// 		);


		// 		$data[] = array(
		// 			'equipment' => $equipment->equipment,
		// 			// 'plate_number' => $trip_ticket->plate_number,
		// 			'driver' => $row->driver_id,
		// 			'driver_full_name' => trim($row->last_name . ", " . $row->first_name . " " . $row->middle_name . " " . $row->suffix),
		// 			// 'trip_ticket' => array(
		// 			// 	'date' => date('m/d/Y', strtotime($trip_ticket->purchase_date)),
		// 			// 	'distance_traveled' => $trip_ticket->approximate_distance_traveled,
		// 			// 	'gasoline_consume' => $trip_ticket->gasoline_purchased,
		// 			// 	'oil_lubricant_used' => $trip_ticket->lubricating_oil_issued_purchased,
		// 			// 	'grease_issued_used' => $trip_ticket->grease_issued_purchased,
		// 			// 	'remarks' => $trip_ticket->purposes,
		// 			// ),
		// 		);

		// 		foreach ($trip_ticket as $trip_ticket_row) {

		// 			// var_dump($trip_ticket_row);

		// 			// echo "<br />";
		// 			// echo "<br />";
		// 			// echo "<br />";
		// 			// echo "<br />";
		// 		}




		// 	}

		// 	// get driver's trip ticket
		// 	// $filter_driver_trip_ticket = ['driver_id' => $row->driver_id, ...$date_range];

		// 	// $trip_ticket = $tripTicketModel->get_driver_trip_ticket($filter_driver_trip_ticket);


		// }

		// // $result =
		// // 	$result = array(
		// // 		'summary_consumption' => $tripTicketModel->get_summary_consumption($data),
		// // 		'product_summary_consumption' => $tripTicketModel->get_product_summary_consumption($data),

		// // 	);
		$this->response($data, RestController::HTTP_OK);

	}



}
