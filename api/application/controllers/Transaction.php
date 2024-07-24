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



}
