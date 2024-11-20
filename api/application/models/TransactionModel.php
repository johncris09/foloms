<?php

defined('BASEPATH') or exit('No direct script access allowed');

class TransactionModel extends CI_Model
{

	public $table = 'supplier';

	public function __construct()
	{
		parent::__construct();
	}

	public function get()
	{

		$query = $this->db
			->query(' 
				SELECT
					date,
					MAX(
						CASE
						WHEN product = 1
						THEN delivery
						ELSE delivery
						END
					) AS diesel_delivery,
					MAX(
						CASE
						WHEN product = 1
						THEN total_consumption
						ELSE 0
						END
					) AS diesel_consumption,
					MAX(
						CASE
						WHEN product = 1
						THEN total_delivery - total_consumption
						ELSE 0
						END
					) AS diesel_balance,
					MAX(
						CASE
						WHEN product = 3
						THEN delivery
						ELSE 0
						END
					) AS regular_delivery,
					MAX(
						CASE
						WHEN product = 3
						THEN total_consumption
						ELSE 0
						END
					) AS regular_consumption,
					MAX(
						CASE
						WHEN product = 3
						THEN total_delivery - total_consumption
						ELSE 0
						END
					) AS regular_balance,
					MAX(
						CASE
						WHEN product = 2
						THEN delivery
						ELSE 0
						END
					) AS premium_delivery,
					MAX(
						CASE
						WHEN product = 2
						THEN total_consumption
						ELSE 0
						END
					) AS premium_consumption,
					MAX(
						CASE
						WHEN product = 2
						THEN total_delivery - total_consumption
						ELSE 0
						END
					) AS premium_balance
					FROM
					(SELECT
						a.DATE,
						a.product,
						a.delivery,
						a.consumption,
						(SELECT
						SUM(b.delivery)
						FROM
						(SELECT
							d.date AS DATE,
							d.product,
							d.liters AS delivery
						FROM
							delivery d
							LEFT JOIN trip_ticket c
							ON d.product = c.product
							AND d.date = c.purchase_date
						UNION
						ALL
						SELECT
							c.purchase_date AS DATE,
							c.product,
							0 AS delivery
						FROM
							trip_ticket c
							LEFT JOIN delivery d
							ON c.product = d.product
							AND c.purchase_date = d.date
						WHERE d.date IS NULL) b
						WHERE b.product = a.product
						AND b.DATE <= a.DATE) AS total_delivery,
						(SELECT
						SUM(b.consumption)
						FROM
						(SELECT
							d.date AS DATE,
							d.product,
							COALESCE(c.gasoline_issued_by_office, 0) + COALESCE(c.gasoline_purchased, 0) AS consumption
						FROM
							delivery d
							LEFT JOIN trip_ticket c
							ON d.product = c.product
							AND d.date = c.purchase_date
						UNION
						ALL
						SELECT
							c.purchase_date AS DATE,
							c.product,
							COALESCE(c.gasoline_issued_by_office, 0) + COALESCE(c.gasoline_purchased, 0) AS consumption
						FROM
							trip_ticket c
							LEFT JOIN delivery d
							ON c.product = d.product
							AND c.purchase_date = d.date
						WHERE d.date IS NULL) b
						WHERE b.product = a.product
						AND b.DATE <= a.DATE) AS total_consumption
					FROM
						(SELECT
						d.date AS DATE,
						d.product,
						d.liters AS delivery,
						COALESCE(c.gasoline_issued_by_office, 0) + COALESCE(c.gasoline_purchased, 0) AS consumption
						FROM
						delivery d
						LEFT JOIN trip_ticket c
							ON d.product = c.product
							AND d.date = c.purchase_date
						UNION
						ALL
						SELECT
						c.purchase_date AS DATE,
						c.product,
						0 AS delivery,
						COALESCE(c.gasoline_issued_by_office, 0) + COALESCE(c.gasoline_purchased, 0) AS consumption
						FROM
						trip_ticket c
						LEFT JOIN delivery d
							ON c.product = d.product
							AND c.purchase_date = d.date
						WHERE d.date IS NULL) a) t1
					GROUP BY DATE
					ORDER BY DATE');
		return $query->result();

	}

	public function get_transaction()
	{
		
		$query = $this->db
			->query('  
				SELECT
				date,
				MAX(
				CASE
					WHEN product = 1
					THEN delivery
					ELSE 0
				END
				) AS diesel_delivery,
				MAX(
				CASE
					WHEN product = 1
					THEN consumption
					ELSE 0
				END
				) AS diesel_consumption,
				MAX(
				CASE
					WHEN product = 2
					THEN delivery
					ELSE 0
				END
				) AS premium_delivery,
				MAX(
				CASE
					WHEN product = 2
					THEN consumption
					ELSE 0
				END
				) AS premium_consumption,
				MAX(
				CASE
					WHEN product = 3
					THEN consumption
					ELSE 0
				END
				) AS regular_consumption,
				MAX(
				CASE
					WHEN product = 3
					THEN delivery
					ELSE 0
				END
				) AS regular_delivery
			FROM
				(SELECT
				DATE,
				product,
				delivery,
				consumption
				FROM
				(SELECT
					d.date AS DATE,
					d.product,
					d.liters AS delivery,
					COALESCE(c.gasoline_issued_by_office, 0) + COALESCE(c.gasoline_purchased, 0) AS consumption
				FROM
					delivery d
					LEFT JOIN trip_ticket c
					ON d.product = c.product
					AND d.date = c.purchase_date
				UNION
				ALL
				SELECT
					c.purchase_date AS DATE,
					c.product,
					0 AS delivery,
					SUM(
					COALESCE(c.gasoline_issued_by_office, 0) + COALESCE(c.gasoline_purchased, 0)
					) AS consumption
				FROM
					trip_ticket c
					LEFT JOIN delivery d
					ON c.product = d.product
					AND c.purchase_date = d.date
				GROUP BY c.purchase_date,
					c.product) AS a) t1
			GROUP BY DATE
			ORDER BY DATE ');


		return $query->result();

	}

	public function filter_transaction($data = null)
	{

		$query_string = '
		
				SELECT
				date,
				MAX(
				CASE
					WHEN product = 1
					THEN delivery
					ELSE 0
				END
				) AS diesel_delivery,
				MAX(
				CASE
					WHEN product = 1
					THEN consumption
					ELSE 0
				END
				) AS diesel_consumption,
				MAX(
				CASE
					WHEN product = 2
					THEN delivery
					ELSE 0
				END
				) AS premium_delivery,
				MAX(
				CASE
					WHEN product = 2
					THEN consumption
					ELSE 0
				END
				) AS premium_consumption,
				MAX(
				CASE
					WHEN product = 3
					THEN consumption
					ELSE 0
				END
				) AS regular_consumption,
				MAX(
				CASE
					WHEN product = 3
					THEN delivery
					ELSE 0
				END
				) AS regular_delivery
			FROM
				(SELECT
				date,
				product,
				delivery,
				consumption
				FROM
				(SELECT
					d.date AS DATE,
					d.product,
					d.liters AS delivery,
					COALESCE(c.gasoline_issued_by_office, 0) + COALESCE(c.gasoline_purchased, 0) AS consumption
				FROM
					delivery d
					LEFT JOIN trip_ticket c
					ON d.product = c.product
					AND d.date = c.purchase_date
				UNION
				ALL
				SELECT
					c.purchase_date AS DATE,
					c.product,
					0 AS delivery,
					SUM(
					COALESCE(c.gasoline_issued_by_office, 0) + COALESCE(c.gasoline_purchased, 0)
					) AS consumption
				FROM
					trip_ticket c
					LEFT JOIN delivery d
					ON c.product = d.product
					AND c.purchase_date = d.date
				GROUP BY c.purchase_date,
					c.product) AS a) t1';

		$query_string .= ' 
			GROUP BY DATE
			ORDER BY DATE';
		

		$query = $this->db->query($query_string);


		return $query->result();

	}


	public function find($id)
	{
		$this->db->where('id', $id);
		$query = $this->db->get($this->table);
		return $query->row();
	}

	public function insert($data)
	{
		return $this->db->insert($this->table, $data);
	}


	public function update($id, $data)
	{
		$this->db->where('id', $id);
		return $this->db->update($this->table, $data);
	}

	public function delete($id)
	{
		return $this->db->delete($this->table, ['id' => $id]);
	}



}
