<?php
defined('BASEPATH') or exit('No direct script access allowed');

require APPPATH . '/libraries/CreatorJwt.php';
require APPPATH . 'libraries/RestController.php';
require APPPATH . 'libraries/Format.php';

use chriskacerguis\RestServer\RestController;

class Office extends RestController
{

	function __construct()
	{
		// Construct the parent class
		parent::__construct();
		$this->load->model('OfficeModel');
		$this->load->model('ProductModel');
		$this->load->model('TripTicketModel');

	}

	public function index_get()
	{
		$officeModel = new OfficeModel;
		$result = $officeModel->get();
		$this->response($result, RestController::HTTP_OK);
	}
	public function top_consumption_get()
	{

		$officeModel = new OfficeModel;
		$productModel = new ProductModel;
		$tripTicketModel = new TripTicketModel;
		$data = [];

		$offices = $officeModel->get();


		foreach ($offices as $office) {

			$officeData = [
				'office' => $office->abbr,
			];

			$total = 0;
			$products = $productModel->get();

			foreach ($products as $product) {


				if (in_array(strtolower($product->product), ['diesel', 'premium', 'regular'])) {

					$whereData = array(
						'office.id' => $office->id,
						'product.id' => $product->id,
					);
					$result = $tripTicketModel->get_total_by_office_by_product($whereData);


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


		// for bar chart

		$categories = [];
		$dieselData = [];
		$premiumData = [];
		$regularData = [];

		foreach ($top10 as $entry) {
			$categories[] = $entry['office'];
			$dieselData[] = (float) $entry['diesel'];
			$premiumData[] = (float) $entry['premium'];
			$regularData[] = (float) $entry['regular'];
		}

		$series = [
			[
				"name" => "Diesel",
				"data" => $dieselData
			],
			[
				"name" => "Premium",
				"data" => $premiumData
			],
			[
				"name" => "Regular",
				"data" => $regularData
			]
		];

		$result = [
			"categories" => $categories,
			"series" => $series
		];



		$this->response($result, RestController::HTTP_OK);

	}
	public function find_get($id)
	{

		$officeModel = new OfficeModel;
		$result = $officeModel->find($id);
		$this->response($result, RestController::HTTP_OK);

	}


	public function insert_post()
	{

		$officeModel = new OfficeModel;
		$requestData = json_decode($this->input->raw_input_stream, true);


		$data = array(
			'abbr' => $requestData['abbr'],
			'office' => $requestData['office'],
		);



		$result = $officeModel->insert($data);

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


		$officeModel = new OfficeModel;
		$requestData = json_decode($this->input->raw_input_stream, true);
		if (isset($requestData['abbr'])) {
			$data['abbr'] = $requestData['abbr'];
		}
		if (isset($requestData['office'])) {
			$data['office'] = $requestData['office'];
		}


		$update_result = $officeModel->update($id, $data);

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
		$officeModel = new OfficeModel;
		$result = $officeModel->delete($id);
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
