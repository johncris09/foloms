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
		$this->load->model('UserModel');

	}

	public function index_get()
	{
		$oldTripTicketModel = new OldTripTicketModel;
		$result = $oldTripTicketModel->get();
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


}
