<?php
defined('BASEPATH') or exit('No direct script access allowed');

require APPPATH . '/libraries/CreatorJwt.php';
require APPPATH . 'libraries/RestController.php';
require APPPATH . 'libraries/Format.php';

use chriskacerguis\RestServer\RestController;

class TripTicket extends RestController
{

	function __construct()
	{
		// Construct the parent class
		parent::__construct();
		$this->load->model('TripTicketModel');
		$this->load->model('ControlNumberModel');
		$this->load->model('ProductModel');
		$this->load->model('UserModel');

	}

	public function index_get()
	{
		$tripTicketModel = new TripTicketModel;
		$result = $tripTicketModel->get();
		$this->response($result, RestController::HTTP_OK);
	}


	public function product_consumption_trend_get()
	{
		$tripTicketModel = new TripTicketModel;
		$productModel = new ProductModel;
		$currentYear = date('Y');

		$products = $productModel->get();

		$categories = [];
		$seriesData = [];

		// Initialize series data array
		foreach ($products as $product) {
			if (in_array(strtolower($product->product), ['diesel', 'premium', 'regular'])) {
				$seriesData[$product->product] = [
					'name' => $product->product,
					'data' => array_fill(0, 12, 0)
				];
			}
		}

		// Loop through each month of the current year
		for ($month = 1; $month <= 12; $month++) {
			// Create a DateTime object for the first day of each month
			$date = DateTime::createFromFormat('Y-m-d', "$currentYear-$month-01");

			// Get the month name
			$categories[] = $date->format('F');
			$monthFormatted = $date->format('m');

			foreach ($products as $product) {
				if (in_array(strtolower($product->product), ['diesel', 'premium', 'regular'])) {
					$trendData = array(
						'trip_ticket.product' => $product->id,
						'month(purchase_date)' => $monthFormatted,
						'year(purchase_date)' => $currentYear,
					);

					$result = $tripTicketModel->get_product_consumption_trend($trendData);

					if ($result) {
						$seriesData[$product->product]['data'][$month - 1] = floatval($result->purchased);
					}
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

	public function filter_product_consumption_trend_get()
	{

		$tripTicketModel = new TripTicketModel;
		$productModel = new ProductModel;

		$products = $productModel->get();
		$requestData = $this->input->get();

		$finalData = [];

		if ($requestData['filter_by'] === 'month') {




			$categories = [];
			$seriesData = [];


			$currentYear = date('Y');
			$currentMonth = $requestData['month'];

			// Initialize series data array
			foreach ($products as $product) {
				if (in_array(strtolower($product->product), ['diesel', 'premium', 'regular'])) {
					$seriesData[$product->product] = [
						'name' => $product->product,
						'data' => array_fill(0, 0, 0)
					];
				}
			}


			$startDate = DateTime::createFromFormat('Y-m-d', "$currentYear-$currentMonth-01");

			// Get the number of days in the specified month
			$daysInMonth = $startDate->format('t');

			for ($day = 1; $day <= $daysInMonth; $day++) {
				// Create a DateTime object for each day of the month
				$date = DateTime::createFromFormat('Y-m-d', "$currentYear-$currentMonth-$day");

				// Get the day formatted as 'd'
				$dayFormatted = $date->format('d');

				// Add the day to the categories array
				$categories[] = $date->format('j'); // 'j' format will give day of the month without leading zeros

				foreach ($products as $product) {
					if (in_array(strtolower($product->product), ['diesel', 'premium', 'regular'])) {
						$trendData = array(
							'trip_ticket.product' => $product->id,
							'day(purchase_date)' => $dayFormatted,
							'month(purchase_date)' => $currentMonth,
							'year(purchase_date)' => $currentYear,
						);

						$result = $tripTicketModel->get_product_consumption_trend($trendData);

						if ($result) {
							$seriesData[$product->product]['data'][$day - 1] = floatval($result->purchased);
						}
					}
				}
			}

			// Prepare the final data structure
			$finalData = [
				'categories' => $categories,
				'series' => array_values($seriesData)
			];



		}

		if ($requestData['filter_by'] === 'year') {


			$currentYear = date('Y');


			$categories = [];
			$seriesData = [];

			// Initialize series data array
			foreach ($products as $product) {
				if (in_array(strtolower($product->product), ['diesel', 'premium', 'regular'])) {
					$seriesData[$product->product] = [
						'name' => $product->product,
						'data' => array_fill(0, 12, 0)
					];
				}
			}

			// Loop through each month of the current year
			for ($month = 1; $month <= 12; $month++) {
				// Create a DateTime object for the first day of each month
				$date = DateTime::createFromFormat('Y-m-d', "$currentYear-$month-01");

				// Get the month name
				$categories[] = $date->format('F');
				$monthFormatted = $date->format('m');

				foreach ($products as $product) {
					if (in_array(strtolower($product->product), ['diesel', 'premium', 'regular'])) {
						$trendData = array(
							'trip_ticket.product' => $product->id,
							'month(purchase_date)' => $monthFormatted,
							'year(purchase_date)' => $currentYear,
						);

						$result = $tripTicketModel->get_product_consumption_trend($trendData);

						if ($result) {
							$seriesData[$product->product]['data'][$month - 1] = floatval($result->purchased);
						}
					}
				}
			}

			// Prepare the final data structure
			$finalData = [
				'categories' => $categories,
				'series' => array_values($seriesData)
			];

		}
		$this->response($finalData, RestController::HTTP_OK);

	}


	public function find_get($id)
	{

		$tripTicketModel = new TripTicketModel;
		$result = $tripTicketModel->find($id);
		$this->response($result, RestController::HTTP_OK);

	}


	public function insert_post()
	{

		$tripTicketModel = new TripTicketModel;
		$controlNumberModel = new ControlNumberModel;

		$requestData = json_decode($this->input->raw_input_stream, true);



		// get the last control number

		$control_number = $controlNumberModel->get_last_control_number();



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
			'control_number' => $control_number->control_number,
		);



		$result = $tripTicketModel->insert($data);

		if ($result > 0) {


			// update the control number
			$control_number_data = array(
				'control_number' => (int) $control_number->control_number + 1,
			);
			$controlNumberModel->update(1, $control_number_data);

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


		$tripTicketModel = new TripTicketModel;

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


		$update_result = $tripTicketModel->update($id, $data);

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
		$tripTicketModel = new TripTicketModel;
		$result = $tripTicketModel->delete($id);
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
		$tripTicketModel = new TripTicketModel;
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
					'trip_ticket.user_id' => $user->id,
					'day(encoded_at)' => $dayFormatted,
					'month(encoded_at)' => $currentMonth,
					'year(encoded_at)' => $currentYear,
				);

				$result = $tripTicketModel->get_work_details($trendData);

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



}
