<?php
defined('BASEPATH') or exit('No direct script access allowed');

require APPPATH . '/libraries/CreatorJwt.php';
require APPPATH . 'libraries/RestController.php';
require APPPATH . 'libraries/Format.php';

use chriskacerguis\RestServer\RestController;

class OldTripTicket extends RestController
{

	function __construct()
	{
		// Construct the parent class
		parent::__construct();
		$this->load->model('OldTripTicketModel');
		$this->load->model('ControlNumberModel');
		$this->load->model('TransactionModel');
		$this->load->model('DeliveryModel');
		$this->load->model('ProductModel');
		$this->load->model('UserModel');

	}

	public function index_get()
	{
		$oldTripTicketModel = new OldTripTicketModel;
		$result = $oldTripTicketModel->get();
		$this->response($result, RestController::HTTP_OK);
	}
	
	public function filter_get()
	{
		$oldTripTicketModel = new OldTripTicketModel;
		$requestData = $this->input->get();

		$filter_data = [];
		if( isset(	$requestData['date'] ) && !empty($requestData['date'])  ){
			$filter_data['purchase_date'] = $requestData['date'];
		}
		if( isset(	$requestData['product'] ) && !empty($requestData['product'])  ){
			$filter_data['product.id'] = $requestData['product'];
		}

		$result = $oldTripTicketModel->filter($filter_data);
		$this->response($result, RestController::HTTP_OK);
	}


	public function find_get($id)
	{

		$oldTripTicketModel = new OldTripTicketModel;
		$result = $oldTripTicketModel->find($id);
		$this->response($result, RestController::HTTP_OK);

	}


	public function insert_post()
	{

		$oldTripTicketModel = new OldTripTicketModel;
		$controlNumberModel = new ControlNumberModel;

		$requestData = json_decode($this->input->raw_input_stream, true);

		$data = array(
			'purchase_date' => $requestData['purchase_date'],
			'product' => $requestData['product'],
			'driver' => $requestData['driver'],
			'equipment' => $requestData['equipment'],
			'authorized_passengers' => $requestData['authorized_passengers'],
			'places_to_visit' => $requestData['places_to_visit'],
			'purposes' => $requestData['purposes'],
			'departure_time' => $requestData['departure_time'],
			'arrival_time_at_destination' => $requestData['arrival_time_at_destination'],
			'departure_time_from_destination' => $requestData['departure_time_from_destination'],
			'arrival_time_back' => $requestData['arrival_time_back'],
			'approximate_distance_traveled' => $requestData['approximate_distance_traveled'],
			'gasoline_balance_in_tank' => $requestData['gasoline_balance_in_tank'],
			'gasoline_issued_by_office' => $requestData['gasoline_issued_by_office'],
			'gasoline_purchased' => $requestData['gasoline_purchased'],
			'gasoline_used' => $requestData['gasoline_used'],
			'gasoline_balance_end_trip' => $requestData['gasoline_balance_end_trip'],
			'gear_oil_issued_purchased' => $requestData['gear_oil_issued_purchased'],
			'lubricating_oil_issued_purchased' => $requestData['lubricating_oil_issued_purchased'],
			'grease_issued_purchased' => $requestData['grease_issued_purchased'],
			'brake_fluid_issued_purchased' => $requestData['brake_fluid_issued_purchased'],
			'speedometer_start' => $requestData['speedometer_start'],
			'speedometer_end' => $requestData['speedometer_end'],
			'distance_traveled' => $requestData['distance_traveled'],
			'remarks' => $requestData['remarks'],
			'user_id' => $requestData['user_id'],
		);



		$result = $oldTripTicketModel->insert($data);

		if ($result > 0) {


			$this->response([
				'status' => true,
				'message' => 'Successfully Inserted.'
			], RestController::HTTP_OK);
		} else {

			$this->response([
				'status' => false,
				'message' => 'Failed to create new user.'
			], RestController::HTTP_BAD_REQUEST);
		}
	}

	public function update_put($id)
	{


		$oldTripTicketModel = new OldTripTicketModel;

		$requestData = json_decode($this->input->raw_input_stream, true);

		if (isset($requestData['purchase_date'])) {
			$data['purchase_date'] = $requestData['purchase_date'];
		}
		if (isset($requestData['product'])) {
			$data['product'] = $requestData['product'];
		}
		if (isset($requestData['driver'])) {
			$data['driver'] = $requestData['driver'];
		}

		if (isset($requestData['equipment'])) {
			$data['equipment'] = $requestData['equipment'];
		}
		if (isset($requestData['authorized_passengers'])) {
			$data['authorized_passengers'] = $requestData['authorized_passengers'];
		}
		if (isset($requestData['places_to_visit'])) {
			$data['places_to_visit'] = $requestData['places_to_visit'];
		}
		if (isset($requestData['purposes'])) {
			$data['purposes'] = $requestData['purposes'];
		}
		if (isset($requestData['departure_time'])) {
			$data['departure_time'] = $requestData['departure_time'];
		}
		if (isset($requestData['arrival_time_at_destination'])) {
			$data['arrival_time_at_destination'] = $requestData['arrival_time_at_destination'];
		}
		if (isset($requestData['departure_time_from_destination'])) {
			$data['departure_time_from_destination'] = $requestData['departure_time_from_destination'];
		}
		if (isset($requestData['arrival_time_back'])) {
			$data['arrival_time_back'] = $requestData['arrival_time_back'];
		}
		if (isset($requestData['approximate_distance_traveled'])) {
			$data['approximate_distance_traveled'] = $requestData['approximate_distance_traveled'];
		}

		if (isset($requestData['gasoline_balance_in_tank'])) {
			$data['gasoline_balance_in_tank'] = $requestData['gasoline_balance_in_tank'];
		}
		if (isset($requestData['gasoline_issued_by_office'])) {
			$data['gasoline_issued_by_office'] = $requestData['gasoline_issued_by_office'];
		}
		if (isset($requestData['gasoline_purchased'])) {
			$data['gasoline_purchased'] = $requestData['gasoline_purchased'];
		}
		if (isset($requestData['gasoline_used'])) {
			$data['gasoline_used'] = $requestData['gasoline_used'];
		}
		if (isset($requestData['gasoline_balance_end_trip'])) {
			$data['gasoline_balance_end_trip'] = $requestData['gasoline_balance_end_trip'];
		}
		if (isset($requestData['gear_oil_issued_purchased'])) {
			$data['gear_oil_issued_purchased'] = $requestData['gear_oil_issued_purchased'];
		}
		if (isset($requestData['lubricating_oil_issued_purchased'])) {
			$data['lubricating_oil_issued_purchased'] = $requestData['lubricating_oil_issued_purchased'];
		}
		if (isset($requestData['grease_issued_purchased'])) {
			$data['grease_issued_purchased'] = $requestData['grease_issued_purchased'];
		}
		if (isset($requestData['brake_fluid_issued_purchased'])) {
			$data['brake_fluid_issued_purchased'] = $requestData['brake_fluid_issued_purchased'];
		}
		if (isset($requestData['speedometer_start'])) {
			$data['speedometer_start'] = $requestData['speedometer_start'];
		}
		if (isset($requestData['speedometer_end'])) {
			$data['speedometer_end'] = $requestData['speedometer_end'];
		}
		if (isset($requestData['distance_traveled'])) {
			$data['distance_traveled'] = $requestData['distance_traveled'];
		}
		if (isset($requestData['remarks'])) {
			$data['remarks'] = $requestData['remarks'];
		}

		 


		$update_result = $oldTripTicketModel->update($id, $data);

		if ($update_result > 0) {
			$this->response([
				'status' => true,
				'message' => 'Successfully Updated.'
			], RestController::HTTP_OK);
		} else {

			$this->response([
				'status' => false,
				'message' => 'Failed to update.'
			], RestController::HTTP_BAD_REQUEST);

		}
	}






	public function delete_delete($id)
	{
		$oldTripTicketModel = new OldTripTicketModel;
		$result = $oldTripTicketModel->delete($id);
		if ($result > 0) {
			$this->response([
				'status' => true,
				'message' => 'Successfully Deleted.'
			], RestController::HTTP_OK);
		} else {

			$this->response([
				'status' => false,
				'message' => 'Failed to delete.'
			], RestController::HTTP_BAD_REQUEST);

		}
	}

 
	

	public function work_trend_get()
	{
		$oldTripTicketModel = new OldTripTicketModel();
		$user = new UserModel;


		
		$requestData = $this->input->get();
		


		$users = $user->get();

		$categories = [];
		$seriesData = []; 

		$currentYear = date('Y');
		$currentMonth = date('m'); 
		
		if(isset($requestData['month']) && !empty($requestData['month'])){
			$currentMonth = $requestData['month'];
		}


		$finalData = []; 

		$startDate = DateTime::createFromFormat('Y-m-d', "$currentYear-$currentMonth-01");

		// Get the number of days in the specified month
		$daysInMonth = $startDate->format('t');

		foreach ($users as $user) {
			$seriesData[$user->id] = [
				'name' => $user->first_name,
				'data' => array_fill(0, $daysInMonth, 0)
			];
		}

		for ($day = 1; $day <= $daysInMonth; $day++) {
			// Create a DateTime object for each day of the month
			$date = DateTime::createFromFormat('Y-m-d', "$currentYear-$currentMonth-$day");

			// Get the day formatted as 'd'
			$dayFormatted = $date->format('d');

			// Add the day to the categories array
			$categories[] = $date->format('j'); // 'j' format will give day of the month without leading zeros

			foreach ($users as $user) {

				$trendData = array(
					'old_trip_ticket.user_id' => $user->id,
					'day(encoded_at)' => $dayFormatted,
					'month(encoded_at)' => $currentMonth,
					'year(encoded_at)' => $currentYear,
				);

				$result = $oldTripTicketModel->get_work_details($trendData);

				if ($result) {
					// $arr = ['john cris', [2,3,3,1]];
					$seriesData[$user->id]['data'][$day - 1] = floatval($result->total);

				}
			}
		}

		// Prepare the final data structure
		$finalData = [
			'categories' => $categories,
			'series' => array_values($seriesData)
		];


		$this->response($finalData, RestController::HTTP_OK);

	}
 
	
	public function monthly_report_filter_get()
	{

		$oldTripTicketModel = new OldTripTicketModel;
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
			$drivers = $oldTripTicketModel->get_driver($date_range);


			foreach ($drivers as $driver) {

				$trip_tickets = $oldTripTicketModel->get_equipment(
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
			$drivers = $oldTripTicketModel->get_driver($date_range);
			foreach ($drivers as $driver) {


				// get the driver's equipment
				$equipments = $oldTripTicketModel->get_equipment_report_type_2([
					'driver.id' => $driver->driver_id,
					'purchase_date >=' => $start_date, // Directly extract date
					'purchase_date <=' => $end_date, // Directly extract date
				]);
				$rows = count($equipments);

				if ($rows > 1) {



					foreach ($equipments as $equipment) {

						$_equipments = $oldTripTicketModel->get_equipment([
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
					$equipments = $oldTripTicketModel->get_equipment([
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


	

	public function transaction_filter_get()
	{ 
	
		$oldTripTicketModel = new OldTripTicketModel;


		$requestData = $this->input->get();

		$result = $oldTripTicketModel->filter_transaction($requestData);

		


		$diesel_balance = $premium_balance = $regular_balance = 0;

		foreach ($result as $row) {


			$diesel_balance += $row->diesel_delivery - $row->diesel_consumption;
			$premium_balance += $row->premium_delivery - $row->premium_consumption;
			$regular_balance += $row->regular_delivery - $row->regular_consumption;

			$transactions[] = [
				'date' => date('m/d/Y', strtotime($row->date)),
				'diesel_delivery' => $row->diesel_delivery,
				'diesel_consumption' => $row->diesel_consumption,
				'diesel_balance' => number_format($diesel_balance, 2, '.', ','),
				'premium_delivery' => $row->premium_delivery,
				'premium_consumption' => $row->premium_consumption,
				'premium_balance' => number_format($premium_balance, 2, '.', ','),
				'regular_delivery' => $row->regular_delivery,
				'regular_consumption' => $row->regular_consumption,
				'regular_balance' => number_format($regular_balance, 2, '.', ','),
			];

			// $counter++;
		}


		$groupedByMonth = [];

		// Group data by month
		foreach ($transactions as $transaction) {
			
			$date = DateTime::createFromFormat('m/d/Y', $transaction['date']);
			if($date){ 
				$monthYear = $date->format('Y-m');

				if (!isset($groupedByMonth[$monthYear])) {
					$groupedByMonth[$monthYear] = [];
				}

				$groupedByMonth[$monthYear][] = $transaction;
			}
		
		}


		$date = $requestData['year'] . '-' . sprintf("%02d", $requestData['month']);

		$dateTime = new DateTime($date);

		// Subtract one month
		$dateTime->modify('-1 month');

		// Format the result back to year and month (Y-m format)
		$previous_month = $dateTime->format('Y-m');

		if (isset($groupedByMonth[$date])) {

			$data_by_month = $groupedByMonth[$date];
			$data = [];
			$counter = 0;
			foreach ($data_by_month as $row) {

				if ($counter == 0) {
					if (isset($groupedByMonth[$previous_month])) {
						$prev = end($groupedByMonth[$previous_month]);
						if (isset($prev)) {
	
							$data[] = array(
								'date' => 'Prev. Balance',
								'diesel_delivery' => 0,
								'diesel_consumption' => 0,
								'diesel_balance' => $prev['diesel_balance'],
								'premium_delivery' => 0,
								'premium_consumption' => 0,
								'premium_balance' => $prev['premium_balance'],
								'regular_delivery' => 0,
								'regular_consumption' => 0,
								'regular_balance' => $prev['regular_balance'],
							);
						}
	
					}

				}
				$data[] = array(
					'date' => date('n/d/Y', strtotime($row['date'])),
					'diesel_delivery' => $row['diesel_delivery'],
					'diesel_consumption' => $row['diesel_consumption'],

					'diesel_balance' => $row['diesel_balance'],

					'premium_delivery' => $row['premium_delivery'],
					'premium_consumption' => $row['premium_consumption'],

					'premium_balance' => $row['premium_balance'],
					'regular_delivery' => $row['regular_delivery'],
					'regular_consumption' => $row['regular_consumption'],

					'regular_balance' => $row['regular_balance'],
				);

				$counter++;
			}

			$this->response($data, RestController::HTTP_OK);

		} else {

			$this->response([], RestController::HTTP_OK);

		}
	}
	
	public function fuel_pump_dispense_filter_get()
	{
		$oldTripTicketModel = new OldTripTicketModel;
		$deliveryModel = new DeliveryModel;
		$productModel = new ProductModel;
		$requestData = $this->input->get();

		$data = [];
		if (isset($requestData['purchase_date']) && $requestData['purchase_date'] != "") {
			$data = array(
				'old_trip_ticket.purchase_date' => date('Y-m-d', strtotime($requestData['purchase_date']))
			);
		}
		if (isset($requestData['office']) && $requestData['office'] != "") {
			$data['equipment.office'] = $requestData['office'];
		}

		$summary_consumptions = $oldTripTicketModel->get_summary_consumption($data);
		$summary_consumption_data = [];
		


		foreach ($summary_consumptions as $summary_consumption) {

			// $this->response($summary_consumption, RestController::HTTP_OK);


			// Extract the control number and purchase date
			// $controlNumber = str_pad($summary_consumption->control_number, 4, '0', STR_PAD_LEFT);
			
			$purchaseDate = date('m-d-y', strtotime($summary_consumption->purchase_date));

			// Combine them into the desired format
			// $formattedControlNumber = $purchaseDate  ;



			$gasoline_purchased = 0;
			$gasoline_purchased = 0;


			$gasoline_purchased += floatval($summary_consumption->gasoline_purchased) + floatval($summary_consumption->gasoline_issued_by_office);

			$gross_amount = floatval($summary_consumption->unit_cost) * $gasoline_purchased;

			$summary_consumption_data[] = array(
				'formatted_control_number' =>  $purchaseDate ,
				'control_number' => "",
				'purchase_date' => date('m/d/Y', strtotime($summary_consumption->purchase_date)),
				'plate_number' => $summary_consumption->plate_number != "" ? trim($summary_consumption->plate_number) : "",
				'model' => $summary_consumption->model != "" ? trim($summary_consumption->model) : "",
				'driver' => trim($summary_consumption->last_name . ", " .
					$summary_consumption->first_name . " " .
					$summary_consumption->middle_name . " " .
					$summary_consumption->suffix),
				'office' =>
					$summary_consumption->abbr != "" ? trim($summary_consumption->abbr) : ""
				,
				'purposes' => trim($summary_consumption->purposes),
				'product' => trim($summary_consumption->product),
				'unit_cost' =>
					number_format($summary_consumption->unit_cost, 2, '.', ','),
				'gasoline_issued_by_office' => trim($summary_consumption->gasoline_issued_by_office),
				'gasoline_purchased' =>
					number_format($gasoline_purchased, 2, '.', ','),
				'gross_amount' =>
					number_format($gross_amount, 2, '.', ','),
			);


		}



		$products = $productModel->get();
		$product_summary_consumption = [];

		$unit_cost = 0;

		foreach ($products as $product) {


			if (in_array(strtolower($product->product), ['diesel', 'premium', 'regular'])) {
				$data['product.id'] = $product->id;

				
				$previous_delivery_data = array(
					'product' => $product->id,
                    'date <=' => date('Y-m-d', strtotime($requestData['purchase_date']))
				);

				$previous_delivery = $oldTripTicketModel->get_previous_delivery_data($previous_delivery_data, 1);

				$unit_cost = 	$previous_delivery->price ;
				
				$consumption = $oldTripTicketModel->get_product_summary_consumption($data);
			
				$product_summary_consumption[] = array(
					'product' => $consumption->product,
					'unit_cost' => $unit_cost,
					'total_purchase' => $consumption->total_purchase ? $consumption->total_purchase : number_format(0, 2, '.', ','),
					// 'total_cost' => $consumption->total_purchase ? $consumption->total_purchase : number_format(0, 2, '.', ','),
				);
			}

		}

		$result = array(
			'consumption' => $summary_consumption_data,
			'summary' => $product_summary_consumption,

		);

		$this->response($result, RestController::HTTP_OK);

	}
	




}
