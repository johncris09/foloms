<?php
defined('BASEPATH') or exit('No direct script access allowed');

require APPPATH . '/libraries/CreatorJwt.php';
require APPPATH . 'libraries/RestController.php';
require APPPATH . 'libraries/Format.php';

use chriskacerguis\RestServer\RestController;

class Delivery extends RestController
{

	function __construct()
	{
		// Construct the parent class
		parent::__construct();
		$this->load->model('DeliveryModel');
		$this->load->model('ProductModel');
		$this->load->model('TripTicketModel');

	}

	public function index_get()
	{
		$deliveryModel = new DeliveryModel;
		$result = $deliveryModel->get();
		$this->response($result, RestController::HTTP_OK);
	}
	public function top_consumption_get()
	{
		$deliveryModel = new DeliveryModel;
		$productModel = new ProductModel;
		$tripTicketModel = new TripTicketModel;
		$data = [];

		$offices = $deliveryModel->get();


		foreach ($offices as $office) {

			$officeData = [
				'office' => $office->office,
			];

			$total = 0;
			$products = $productModel->get();

			foreach ($products as $product) {


				if (in_array(strtolower($product->product), ['diesel', 'premium', 'regular'])) {

					$whereData = array(
						'office.id' => $office->id,
						'product.id' => $product->id,
					);
					$result = $tripTicketModel->get_total_by_office_by_product($whereData, $product->product);

					// Append the product data to the office data array
					$officeData[strtolower($result->product)] = $result->purchased > 0 ? number_format($result->purchased, 2, '.', ',') : 0;

					$total += $result->purchased;

				}

			}

			$officeData['total'] = number_format($total, 2, '.', ',');

			$data[] = $officeData;

		}


		usort($data, function ($a, $b) {
			return $b['total'] <=> $a['total'];
		});

		$top10 = array_slice($data, 0, 10);
		$this->response($top10, RestController::HTTP_OK);

	}
	public function find_get($id)
	{

		$deliveryModel = new DeliveryModel;
		$result = $deliveryModel->find($id);
		$this->response($result, RestController::HTTP_OK);

	}


	public function insert_post()
	{

		$deliveryModel = new DeliveryModel;
		$requestData = json_decode($this->input->raw_input_stream, true);


		$data = array(
			'date' => $requestData['date'],
			'liters' => $requestData['liters'],
			'supplier' => $requestData['supplier'],
			'product' => $requestData['product'],
 
		);



		$result = $deliveryModel->insert($data);

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


		$deliveryModel = new DeliveryModel;
		$requestData = json_decode($this->input->raw_input_stream, true);
		if (isset($requestData['date'])) {
			$data['date'] = $requestData['date'];
		}
		if (isset($requestData['liters'])) {
			$data['liters'] = $requestData['liters'];
		}

		if (isset($requestData['supplier'])) {
			$data['supplier'] = $requestData['supplier'];
		}
		if (isset($requestData['product'])) {
			$data['product'] = $requestData['product'];
		}

		$update_result = $deliveryModel->update($id, $data);

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
		$deliveryModel = new DeliveryModel;
		$result = $deliveryModel->delete($id);
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
