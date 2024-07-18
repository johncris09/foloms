<?php
defined('BASEPATH') or exit('No direct script access allowed');

require APPPATH . '/libraries/CreatorJwt.php';
require APPPATH . 'libraries/RestController.php';
require APPPATH . 'libraries/Format.php';

use chriskacerguis\RestServer\RestController;

class Product extends RestController
{

	function __construct()
	{
		// Construct the parent class
		parent::__construct();
		$this->load->model('ProductModel');
		$this->load->model('TripTicketModel');

	}

	public function index_get()
	{
		$productModel = new ProductModel;
		$result = $productModel->get();
		$this->response($result, RestController::HTTP_OK);
	}
	public function total_consumption_get()
	{

		$tripTicketModel = new TripTicketModel;
		$productModel = new ProductModel;
		$data = [];
		$classname = ['bg-c-blue', 'bg-c-green', 'bg-c-yellow'];
		$products = $productModel->get();
		$counter = 0;
		foreach ($products as $product) {


			if (in_array(strtolower($product->product), ['diesel', 'premium', 'regular'])) {

				$result = $tripTicketModel->get_total_consumption(['trip_ticket.product' => $product->id]);

				if ($result->product) {

					$data[] = array(
						'product' => $result->product,
						'total_consumption' => number_format($result->total_consumption, 2, '.', ','),
						'classname' => $classname[$counter],

					);
					$counter++;


				}
			}

		}

		$this->response($data, RestController::HTTP_OK);
	}
	public function find_get($id)
	{

		$productModel = new ProductModel;
		$result = $productModel->find($id);
		$this->response($result, RestController::HTTP_OK);

	}


	public function insert_post()
	{

		$productModel = new ProductModel;
		$requestData = json_decode($this->input->raw_input_stream, true);


		$data = array(
			'product' => $requestData['product'],
		);



		$result = $productModel->insert($data);

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


		$productModel = new ProductModel;
		$requestData = json_decode($this->input->raw_input_stream, true);
		if (isset($requestData['product'])) {
			$data['product'] = $requestData['product'];
		}
		$update_result = $productModel->update($id, $data);

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
		$productModel = new ProductModel;
		$result = $productModel->delete($id);
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
