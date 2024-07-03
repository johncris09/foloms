<?php
defined('BASEPATH') or exit('No direct script access allowed');

require APPPATH . '/libraries/CreatorJwt.php';
require APPPATH . 'libraries/RestController.php';
require APPPATH . 'libraries/Format.php';

use chriskacerguis\RestServer\RestController;

class EquipmentType extends RestController
{

	function __construct()
	{
		// Construct the parent class
		parent::__construct();
		$this->load->model('EquipmentTypeModel');

	}

	public function index_get()
	{
		$equipmentTypeModel = new EquipmentTypeModel;
		$result = $equipmentTypeModel->get();
		$this->response($result, RestController::HTTP_OK);
	}
	public function find_get($id)
	{

		$equipmentTypeModel = new EquipmentTypeModel;
		$result = $equipmentTypeModel->find($id);
		$this->response($result, RestController::HTTP_OK);

	}


	public function insert_post()
	{

		$equipmentTypeModel = new EquipmentTypeModel;
		$requestData = json_decode($this->input->raw_input_stream, true);


		$data = array(
			'type' => $requestData['type'],
			'times' => $requestData['times'],
			'tank_balance' => $requestData['tank_balance'],
		);



		$result = $equipmentTypeModel->insert($data);

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


		$equipmentTypeModel = new EquipmentTypeModel;

		$requestData = json_decode($this->input->raw_input_stream, true);

		if (isset($requestData['type'])) {
			$data['type'] = $requestData['type'];
		}
		if (isset($requestData['times'])) {
			$data['times'] = $requestData['times'];
		}
		if (isset($requestData['tank_balance'])) {
			$data['tank_balance'] = $requestData['tank_balance'];
		}

		$update_result = $equipmentTypeModel->update($id, $data);

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
		$equipmentTypeModel = new EquipmentTypeModel;
		$result = $equipmentTypeModel->delete($id);
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
