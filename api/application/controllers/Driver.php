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
		$this->load->model('ProductModel');
		$this->load->model('TripTicketModel');

	}

	public function index_get()
	{
		$driverModel = new DriverModel;
		$result = $driverModel->get();
		$this->response($result, RestController::HTTP_OK);
	}


	public function top_consumption_get()
	{
		$driverModel = new DriverModel;
		$productModel = new ProductModel;
		$tripTicketModel = new TripTicketModel;
		$data = [];

		$drivers = $driverModel->get();


		foreach ($drivers as $driver) {


			$driverData = [
				'driver' => trim($driver->last_name . ", " . $driver->first_name . " " . $driver->middle_name . " " . $driver->suffix),
			];

			$total = 0;
			$products = $productModel->get();

			foreach ($products as $product) {


				if (in_array(strtolower($product->product), ['diesel', 'premium', 'regular'])) {

					$whereData = array(
						'driver.id' => $driver->id,
						'product.id' => $product->id,
					);
					$result = $tripTicketModel->get_total_by_driver_by_product($whereData);

					// Append the product data to the driver data array
					$driverData[strtolower($result->product)] = $result->purchased > 0 ? number_format($result->purchased, 2, '.', ',') : 0;

					$total += $result->purchased;
				}


			}

			$driverData['total'] = number_format($total, 2, '.', ',');

			$data[] = $driverData;

		}


		usort($data, function ($a, $b) {
			return $b['total'] <=> $a['total'];
		});

		$top10 = array_slice($data, 0, 10);
		$this->response($top10, RestController::HTTP_OK);

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
