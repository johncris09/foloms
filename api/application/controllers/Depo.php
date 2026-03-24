<?php
defined('BASEPATH') or exit('No direct script access allowed');

require APPPATH . '/libraries/CreatorJwt.php';
require APPPATH . 'libraries/RestController.php';
require APPPATH . 'libraries/Format.php';

use chriskacerguis\RestServer\RestController;

class Depo extends RestController
{

	function __construct()
	{
		parent::__construct();
		$this->load->model('DepoModel');
	}

	public function index_get()
	{
		$depoModel = new DepoModel;
		$result = $depoModel->get();

		$this->response($result, RestController::HTTP_OK);
	}

	public function find_get($id)
	{
		$depoModel = new DepoModel;
		$result = $depoModel->find($id);
		$this->response($result, RestController::HTTP_OK);
	}

	public function insert_post()
	{
		$depoModel = new DepoModel;
		$requestData = json_decode($this->input->raw_input_stream, true);

		if (empty($requestData['name'])) {
			$this->response([
				'status' => false,
				'message' => 'Depo name is required.'
			], RestController::HTTP_BAD_REQUEST);
			return;
		}

		$data = array(
			'name' => trim($requestData['name']),
			'location' => isset($requestData['location']) ? trim($requestData['location']) : null,
		);

		$result = $depoModel->insert($data);

		if ($result > 0) {
			$this->response([
				'status' => true,
				'message' => 'Successfully Inserted.'
			], RestController::HTTP_OK);
		} else {
			$this->response([
				'status' => false,
				'message' => 'Failed to insert depo.'
			], RestController::HTTP_BAD_REQUEST);
		}
	}

	public function update_put($id)
	{
		$depoModel = new DepoModel;
		$requestData = json_decode($this->input->raw_input_stream, true);
		$data = [];

		if (isset($requestData['name'])) {
			$data['name'] = trim($requestData['name']);
		}
		if (isset($requestData['location'])) {
			$data['location'] = trim($requestData['location']);
		}

		if (empty($data)) {
			$this->response([
				'status' => false,
				'message' => 'No changes provided.'
			], RestController::HTTP_BAD_REQUEST);
			return;
		}

		$update_result = $depoModel->update($id, $data);

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
		$depoModel = new DepoModel;

		if ($depoModel->has_trip_tickets($id)) {
			$this->response([
				'status' => false,
				'message' => 'Cannot delete this depo because it is already used in trip tickets.'
			], RestController::HTTP_BAD_REQUEST);
			return;
		}

		$result = $depoModel->delete($id);
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
