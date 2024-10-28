<?php
defined('BASEPATH') or exit('No direct script access allowed');

require APPPATH . '/libraries/CreatorJwt.php';
require APPPATH . 'libraries/RestController.php';
require APPPATH . 'libraries/Format.php';

use chriskacerguis\RestServer\RestController;

class Transaction extends RestController
{

	function __construct()
	{
		// Construct the parent class
		parent::__construct();
		$this->load->model('TransactionModel');
		$this->load->model('ProductModel');
		$this->load->model('TripTicketModel');

	}

	public function index_get()
	{
		$transactionModel = new TransactionModel;
		$result = $transactionModel->get_transaction();



		$diesel_balance = 0;
		$premium_balance = 0;
		$regular_balance = 0;

		$data = [];
		foreach ($result as $row) {


			// Calculate new balances
			$diesel_balance += $row->diesel_delivery - $row->diesel_consumption;
			$premium_balance += $row->premium_delivery - $row->premium_consumption;
			$regular_balance += $row->regular_delivery - $row->regular_consumption;

			$data[] = array(
				'date' => date('n/d/Y', strtotime($row->date)),
				'diesel_delivery' => $row->diesel_delivery,
				'diesel_consumption' => $row->diesel_consumption,
				'diesel_balance' => number_format($diesel_balance, 2, '.', ','),
				'premium_delivery' => $row->premium_delivery,
				'premium_consumption' => $row->premium_consumption,
				'premium_balance' => number_format($premium_balance, 2, '.', ','),
				'regular_delivery' => $row->regular_delivery,
				'regular_consumption' => $row->regular_consumption,
				'regular_balance' => number_format($regular_balance, 2, '.', ','),
			);

		}
		$this->response($data, RestController::HTTP_OK);
	}



	public function filter_get()
	{
		$transactionModel = new TransactionModel;

		$requestData = $this->input->get();

		$result = $transactionModel->filter_transaction($requestData);

		$diesel_balance = $premium_balance = $regular_balance = 0;

		foreach ($result as $row) {


			$diesel_balance += $row->diesel_delivery - $row->diesel_consumption;
			$premium_balance += $row->premium_delivery - $row->premium_consumption;
			$regular_balance += $row->regular_delivery - $row->regular_consumption;

			$transaction[] = [
				'date' => date('m/d/Y', strtotime($row->date)),
				'diesel_delivery' => $row->diesel_delivery,
				'diesel_consumption' => $row->diesel_consumption,
				'diesel_balance' => number_format($diesel_balance, 2, '.', ','),
				'premium_delivery' => $row->premium_delivery,
				'premium_consumption' => $row->premium_consumption,
				'premium_balance' => number_format($premium_balance, 2, '.', ','),
				'regular_delivery' => $row->regular_delivery,
				'regular_consumption' => $row->regular_consumption,
				'regular_balance' => number_format($regular_balance, 2, '.', ','),
			];

			// $counter++;
		}


		$groupedByMonth = [];

		// Group data by month
		foreach ($transaction as $transaction) {
			$date = DateTime::createFromFormat('m/d/Y', $transaction['date']);
			$monthYear = $date->format('Y-m');

			if (!isset($groupedByMonth[$monthYear])) {
				$groupedByMonth[$monthYear] = [];
			}

			$groupedByMonth[$monthYear][] = $transaction;
		}


		$date = $requestData['year'] . '-' . sprintf("%02d", $requestData['month']);

		$dateTime = new DateTime($date);

		// Subtract one month
		$dateTime->modify('-1 month');

		// Format the result back to year and month (Y-m format)
		$previous_month = $dateTime->format('Y-m');

		if (isset($groupedByMonth[$date])) {

			$data_by_month = $groupedByMonth[$date];
			$data = [];
			$counter = 0;
			foreach ($data_by_month as $row) {

				if ($counter == 0) {
					if (isset($groupedByMonth[$previous_month])) {
						$prev = end($groupedByMonth[$previous_month]);
						if (isset($prev)) {
	
							$data[] = array(
								'date' => 'Prev. Balance',
								'diesel_delivery' => 0,
								'diesel_consumption' => 0,
								'diesel_balance' => $prev['diesel_balance'],
								'premium_delivery' => 0,
								'premium_consumption' => 0,
								'premium_balance' => $prev['premium_balance'],
								'regular_delivery' => 0,
								'regular_consumption' => 0,
								'regular_balance' => $prev['regular_balance'],
							);
						}
	
					}

				}
				$data[] = array(
					'date' => date('n/d/Y', strtotime($row['date'])),
					'diesel_delivery' => $row['diesel_delivery'],
					'diesel_consumption' => $row['diesel_consumption'],

					'diesel_balance' => $row['diesel_balance'],

					'premium_delivery' => $row['premium_delivery'],
					'premium_consumption' => $row['premium_consumption'],

					'premium_balance' => $row['premium_balance'],
					'regular_delivery' => $row['regular_delivery'],
					'regular_consumption' => $row['regular_consumption'],

					'regular_balance' => $row['regular_balance'],
				);

				$counter++;
			}

			$this->response($data, RestController::HTTP_OK);

		} else {

			$this->response([], RestController::HTTP_OK);

		}
	}


	private function get_previous_transaction($data)
	{
		$transactionModel = new TransactionModel;

		$month = isset($data['month']) ? (int) $data['month'] - 1 : 12;
		$year = isset($data['year']) ? $data['year'] : date('Y');

		// Handle edge case for January to previous year December
		if ($month == 0) {
			$month = 12;
			$year = (int) $year - 1;
		}

		$requestData = [
			'month' => $month,
			'year' => $year
		];

		$result = $transactionModel->filter_transaction($requestData);
		return $result;
		$diesel_balance = 6394.09;
		$premium_balance = 0;
		$regular_balance = 0;

		foreach ($result as $row) {
			$diesel_balance += $row->diesel_delivery - $row->diesel_consumption;
			$premium_balance += $row->premium_delivery - $row->premium_consumption;
			$regular_balance += $row->regular_delivery - $row->regular_consumption;
		}

		return [
			'diesel_balance' => $diesel_balance,
			'premium_balance' => $premium_balance,
			'regular_balance' => $regular_balance,
		];
	}

	public function remaining_balance_get()
	{
		$transactionModel = new TransactionModel;
		$result = $transactionModel->get_transaction();


		$diesel_delivery = 0;
		$premium_delivery = 0;
		$regular_delivery = 0;

		$diesel_balance = 0;
		$premium_balance = 0;
		$regular_balance = 0;

		$data = [];
		foreach ($result as $row) {


			// Calculate new balances
			$diesel_balance += $row->diesel_delivery - $row->diesel_consumption;
			$premium_balance += $row->premium_delivery - $row->premium_consumption;
			$regular_balance += $row->regular_delivery - $row->regular_consumption;

			// total delivery

			$diesel_delivery += $row->diesel_delivery;
			$premium_delivery += $row->premium_delivery;
			$regular_delivery += $row->regular_delivery;


		}
		$data = array(
			array(
				'product' => 'Diesel',
				'classname' => 'bg-c-blue',
				'balance' => number_format($diesel_balance, 2, '.', ','),
				'delivery' => number_format($diesel_delivery, 2, '.', ','),
				'consumption' => number_format($diesel_delivery - $diesel_balance, 2, '.', ','),
				'percentage_balance' => floatval($this->calculatePercentage($diesel_balance, $diesel_delivery)),
				'liquidStyle' => '#187cee',
				'outerStyle' => '#0d58ad',
				'dryStyle' => 'black',
				'wetStyle' => 'black',
			),
			array(
				'product' => 'Premium',
				'classname' => 'bg-c-green',
				'balance' => number_format($premium_balance, 2, '.', ','),
				'delivery' => number_format($premium_delivery, 2, '.', ','),
				'consumption' => number_format($premium_delivery - $premium_balance, 2, '.', ','),
				'percentage_balance' => floatval($this->calculatePercentage($premium_balance, $premium_delivery)),
				'liquidStyle' => '#5ac2ad',
				'outerStyle' => '#2ed8b6',
				'dryStyle' => 'black',
				'wetStyle' => 'black',
			),
			array(
				'product' => 'Regular',
				'classname' => 'bg-c-yellow',
				'balance' => number_format($regular_balance, 2, '.', ','),
				'delivery' => number_format($regular_delivery, 2, '.', ','),
				'consumption' => number_format($regular_delivery - $regular_balance, 2, '.', ','),
				'percentage_balance' => floatval($this->calculatePercentage($regular_balance, $regular_delivery)),
				'liquidStyle' => '#db9430',
				'outerStyle' => '#FFB64D',
				'dryStyle' => 'black',
				'wetStyle' => 'black',
			),

		);

		$this->response($data, RestController::HTTP_OK);
	}




	// Function to calculate percentage
	private function calculatePercentage($balance, $delivery)
	{
		$balanceNum = floatval(str_replace(',', '', $balance));
		$deliveryNum = floatval(str_replace(',', '', $delivery));

		if ($deliveryNum == 0)
			return 0;

		$percentage = ($balanceNum / $deliveryNum) * 100;
		return number_format($percentage, 2, '.', ',');
	}


	public function total_delivery_get()
	{
		$transactionModel = new TransactionModel;
		$result = $transactionModel->get_transaction();



		$diesel_delivery = 0;
		$premium_delivery = 0;
		$regular_delivery = 0;

		$data = [];
		foreach ($result as $row) {


			// Calculate new deliverys
			$diesel_delivery += $row->diesel_delivery;
			$premium_delivery += $row->premium_delivery;
			$regular_delivery += $row->regular_delivery;


		}
		$data = array(
			array(
				'product' => 'Diesel',
				'classname' => 'bg-c-blue',
				'delivery' => number_format($diesel_delivery, 2, '.', ',')
			),
			array(
				'product' => 'Premium',
				'classname' => 'bg-c-green',
				'delivery' => number_format($premium_delivery, 2, '.', ',')
			),
			array(
				'product' => 'Regular',
				'classname' => 'bg-c-yellow',
				'delivery' => number_format($regular_delivery, 2, '.', ',')
			),

		);

		$this->response($data, RestController::HTTP_OK);
	}




	public function get_transaction_get()
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
		// $finalData = [
		// 	'categories' => $categories,
		// 	'series' => array_values($seriesData)
		// ];


		$this->response(array_values($seriesData), RestController::HTTP_OK);
	}



}
