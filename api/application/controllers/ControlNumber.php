<?php
defined('BASEPATH') or exit('No direct script access allowed');

require APPPATH . 'libraries/RestController.php';
require APPPATH . 'libraries/Format.php';

use chriskacerguis\RestServer\RestController;

class ControlNumber extends RestController
{

	function __construct()
	{
		// Construct the parent class
		parent::__construct();
		$this->load->model('ControlNumberModel');

	}
	public function index_get()
	{
		$controlNumberModel = new ControlNumberModel;
		$result = $controlNumberModel->getAll();
		$this->response($result, RestController::HTTP_OK);
	}


	public function last_get()
	{
		$controlNumberModel = new ControlNumberModel;
		$result = $controlNumberModel->get_last_control_number();
		$this->response($result, RestController::HTTP_OK);
	}



	public function update_put($id)
	{


		$controlNumberModel = new ControlNumberModel;

		$requestData = json_decode($this->input->raw_input_stream, true);

		$data = array(
			'control_number' => $requestData['control_number'],

		);

		$update_result = $controlNumberModel->update($id, $data);

		if ($update_result > 0) {
			$this->response([
				'status' => true,
				'message' => 'Successfully Updated.'
			], RestController::HTTP_OK);
		} else {

			$this->response([
				'status' => false,
				'message' => 'Failed to update Course.'
			], RestController::HTTP_BAD_REQUEST);

		}
	}

}
