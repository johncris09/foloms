<?php
defined('BASEPATH') or exit('No direct script access allowed');

require APPPATH . '/libraries/CreatorJwt.php';
require APPPATH . 'libraries/RestController.php';
require APPPATH . 'libraries/Format.php';

use chriskacerguis\RestServer\RestController;

class Driver extends RestController
{

	function __construct()
	{
		// Construct the parent class
		parent::__construct();
		$this->load->model('DriverModel');

	}

	public function index_get()
	{
		$driverModel = new DriverModel;
		$result = $driverModel->get();
		$this->response($result, RestController::HTTP_OK);
	}
	public function find_get($id)
	{

		$driverModel = new DriverModel;
		$result = $driverModel->find($id);
		$this->response($result, RestController::HTTP_OK);

	}


	public function insert_post()
	{

		$driverModel = new DriverModel;
		$requestData = json_decode($this->input->raw_input_stream, true);


		$data = array(
			'first_name' => $requestData['first_name'],
			'last_name' => $requestData['last_name'],
			'middle_name' => $requestData['middle_name'],
			'suffix' => $requestData['suffix'],
			'contact_number' => $requestData['contact_number'],
			'job_description' => $requestData['job_description'],
		);



		$result = $driverModel->insert($data);

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


		$driverModel = new DriverModel;
		$requestData = json_decode($this->input->raw_input_stream, true);
		if (isset($requestData['first_name'])) {
			$data['first_name'] = $requestData['first_name'];
		}
		if (isset($requestData['last_name'])) {
			$data['last_name'] = $requestData['last_name'];
		}
		if (isset($requestData['middle_name'])) {
			$data['middle_name'] = $requestData['middle_name'];
		}
		if (isset($requestData['suffix'])) {
			$data['suffix'] = $requestData['suffix'];
		}
		if (isset($requestData['contact_number'])) {
			$data['contact_number'] = $requestData['contact_number'];
		}
		if (isset($requestData['job_description'])) {
			$data['job_description'] = $requestData['job_description'];
		}


		$update_result = $driverModel->update($id, $data);

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
		$driverModel = new DriverModel;
		$result = $driverModel->delete($id);
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




}
