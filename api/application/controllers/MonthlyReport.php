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

		$start_date = date('Y-m-d', strtotime($requestData['start_date']));
		$end_date = date('Y-m-d', strtotime($requestData['end_date']));


		if ($requestData['report_type'] == 1) {


			$date_range = array(
				'start_date' => $start_date, // Directly extract date
				'end_date' => $end_date, // Directly extract date
				'report_type' => $requestData['report_type'],
			);
			$data = [];
			// group by driver and equipment base on date range
			$drivers = $tripTicketModel->get_driver($date_range);


			foreach ($drivers as $driver) {

				$trip_tickets = $tripTicketModel->get_equipment(
					[
						'purchase_date >=' => $start_date, // Directly extract date
						'purchase_date <=' => $end_date, // Directly extract date
						'driver.id' => $driver->driver_id,
						'equipment.id' => $driver->equipment_id,
					]
				);


				$tripTicketData = [];

				$total_approximate_distance_traveled = 0;
				$total_purchased = 0;
				$total_lubricating_oil_issued_purchased = 0;
				$total_grease_issued_purchased = 0;

				foreach ($trip_tickets as $trip_ticket) {

					$sub_total = 0;

					$sub_total += floatval($trip_ticket->gasoline_purchased) + floatval($trip_ticket->gasoline_issued_by_office);


					$total_approximate_distance_traveled += floatval($trip_ticket->approximate_distance_traveled);
					$total_lubricating_oil_issued_purchased += floatval($trip_ticket->lubricating_oil_issued_purchased);
					$total_grease_issued_purchased += floatval($trip_ticket->grease_issued_purchased);


					$total_purchased += $sub_total;
					$tripTicketData[] = array(
						'purposes' => boolval($trip_ticket->include_description) ? trim($trip_ticket->purposes) : '',
						'purchase_date' => date('m/d/Y', strtotime($trip_ticket->purchase_date)),
						'gasoline_issued_by_office' => $trip_ticket->gasoline_purchased,
						'lubricating_oil_issued_purchased' => $trip_ticket->lubricating_oil_issued_purchased,
						'approximate_distance_traveled' => $trip_ticket->approximate_distance_traveled,
						'distance_traveled' => $trip_ticket->distance_traveled,
						'grease_issued_purchased' => $trip_ticket->grease_issued_purchased,
						'include_description' => boolval($trip_ticket->include_description),
						'sub_total' => $sub_total,
					);


				}

				$data[] = array(

					'total_approximate_distance_traveled' => $total_approximate_distance_traveled,
					'total_purchased' => $total_purchased,
					'total_lubricating_oil_issued_purchased' => $total_lubricating_oil_issued_purchased,
					'total_grease_issued_purchased' => $total_grease_issued_purchased,
					'plate_number' => trim($driver->plate_number),
					'model' => trim($driver->model),
					'driver_full_name' => strtoupper(trim($driver->last_name . ", " . $driver->first_name . " " . $driver->middle_name . " " . $driver->suffix)),
					'trip_ticket' => $tripTicketData,
				);
			}


		}

		if ($requestData['report_type'] == 2) {



			$date_range = array(
				'start_date' => $start_date,
				'end_date' => $end_date,
				'report_type' => $requestData['report_type'],
			);
			$data = [];
			// group by driver  base on date range
			$drivers = $tripTicketModel->get_driver($date_range);
			foreach ($drivers as $driver) {


				// get the driver's equipment
				$equipments = $tripTicketModel->get_equipment_report_type_2([
					'driver.id' => $driver->driver_id,
					'purchase_date >=' => $start_date, // Directly extract date
					'purchase_date <=' => $end_date, // Directly extract date
				]);
				$rows = count($equipments);

				if ($rows > 1) {



					foreach ($equipments as $equipment) {

						$_equipments = $tripTicketModel->get_equipment([
							'driver.id' => $driver->driver_id,
							'purchase_date >=' => $start_date, // Directly extract date
							'purchase_date <=' => $end_date, // Directly extract date
							'equipment.id' => $equipment->equipment,
						]);


						$tripTicketData = [];
						foreach ($_equipments as $sub_equipment) {
							$tripTicketData[] = array(
								'purchase_date' => date('m/d/Y', strtotime($sub_equipment->purchase_date)),
								'model' => trim($sub_equipment->model),
								'plate_number' => trim($sub_equipment->plate_number),
								'departure_time' => date('h:i A', strtotime($sub_equipment->departure_time)),
								'arrival_time_at_destination' => date('h:i A', strtotime($sub_equipment->departure_time_from_destination)),
								'departure_time_from_destination' => date('h:i A', strtotime($sub_equipment->departure_time_from_destination)),
								'arrival_time_back' => date('h:i A', strtotime($sub_equipment->arrival_time_back)),
								'gasoline_issued_by_office' => $sub_equipment->gasoline_issued_by_office,
								'gasoline_purchased' => $sub_equipment->gasoline_purchased,
								'total_purchased' => floatval($sub_equipment->gasoline_purchased) + floatval($sub_equipment->gasoline_issued_by_office),
							);
						}


						$data[] = array(

							'driver_full_name' => strtoupper(trim($driver->last_name . ", " . $driver->first_name . " " . $driver->middle_name . " " . $driver->suffix)),
							'trip_ticket' => $tripTicketData,
						);
					}



				}


				if ($rows == 1) {

					// get the driver's equipment
					$equipments = $tripTicketModel->get_equipment([
						'driver.id' => $driver->driver_id,
						'purchase_date >=' => $start_date, // Directly extract date
						'purchase_date <=' => $end_date, // Directly extract date
						'equipment.id' => $driver->equipment_id,
					]);
					$tripTicketData = [];
					foreach ($equipments as $equipment) {
						$tripTicketData[] = array(
							'purchase_date' => date('m/d/Y', strtotime($equipment->purchase_date)),
							'model' => trim($equipment->model),
							'plate_number' => trim($equipment->plate_number),
							'departure_time' => date('h:i A', strtotime($equipment->departure_time)),
							'arrival_time_at_destination' => date('h:i A', strtotime($equipment->departure_time_from_destination)),
							'departure_time_from_destination' => date('h:i A', strtotime($equipment->departure_time_from_destination)),
							'arrival_time_back' => date('h:i A', strtotime($equipment->arrival_time_back)),
							'gasoline_issued_by_office' => $equipment->gasoline_issued_by_office,
							'gasoline_purchased' => $equipment->gasoline_purchased,
							'total_purchased' => floatval($equipment->gasoline_purchased) + floatval($equipment->gasoline_issued_by_office),
						);
					}

					$data[] = array(

						'driver_full_name' => strtoupper(trim($driver->last_name . ", " . $driver->first_name . " " . $driver->middle_name . " " . $driver->suffix)),
						'trip_ticket' => $tripTicketData,
					);
				}





			}

			$this->response($data, RestController::HTTP_OK);
		}


		$this->response($data, RestController::HTTP_OK);

	}



}
