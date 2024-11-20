<?php

defined('BASEPATH') or exit('No direct script access allowed');

class OldTripTicketModel extends CI_Model
{

	public $table = 'old_trip_ticket';

	public function __construct()
	{
		parent::__construct();
	}

	public function get()
	{
		$this->db
			->select('
				old_trip_ticket.id,
				old_trip_ticket.purchase_date,
				old_trip_ticket.driver,
				old_trip_ticket.unit_cost,
				old_trip_ticket.equipment,
				old_trip_ticket.authorized_passengers,
				old_trip_ticket.places_to_visit,
				old_trip_ticket.purposes,
				old_trip_ticket.departure_time,
				old_trip_ticket.arrival_time_at_destination,
				old_trip_ticket.departure_time_from_destination,
				old_trip_ticket.arrival_time_back,
				old_trip_ticket.approximate_distance_traveled,
				old_trip_ticket.gasoline_balance_in_tank,
				old_trip_ticket.gasoline_issued_by_office,
				old_trip_ticket.gasoline_purchased,
				old_trip_ticket.gasoline_used,
				old_trip_ticket.gasoline_balance_end_trip,
				old_trip_ticket.gear_oil_issued_purchased,
				old_trip_ticket.lubricating_oil_issued_purchased,
				old_trip_ticket.grease_issued_purchased,
				old_trip_ticket.brake_fluid_issued_purchased,
				old_trip_ticket.speedometer_start,
				old_trip_ticket.speedometer_end,
				old_trip_ticket.distance_traveled,
				old_trip_ticket.remarks,
				old_trip_ticket.encoded_at,
				product.id as product_id,
				product.product,
				driver.id as driver_id,
				driver.first_name as driver_first_name,
				driver.last_name as driver_last_name,
				driver.middle_name as driver_middle_name,
				driver.suffix as driver_suffix,
				equipment.id as equipment_id,
				equipment.model,
				equipment.plate_number,
				equipment.fuel_capacity,
				equipment_type.tank_balance,
				equipment.office,
				equipment_type.times,
				office.id office_id,
				office.office,
				office.abbr,
				users.id user_id,
				users.first_name user_first_name,
				users.last_name user_last_name,
				users.middle_name user_middle_name,
				')
			->from('old_trip_ticket')
			->join('product', 'old_trip_ticket.product = product.id', 'LEFT')
			->join('driver', 'old_trip_ticket.driver = driver.id', 'LEFT')
			->join('equipment', 'old_trip_ticket.equipment = equipment.id', 'LEFT')
			->join('equipment_type', 'equipment.equipment_type = equipment_type.id', 'LEFT')
			->join('office', 'equipment.office = office.id', 'LEFT')
			->join('users', 'old_trip_ticket.user_id = users.id', 'LEFT')
			->order_by('old_trip_ticket.purchase_date', 'desc');


		$query = $this->db->get();
		return $query->result();
	}



	public function filter($data)
	{
		$this->db
			->select('
				old_trip_ticket.id,
				old_trip_ticket.purchase_date,
				old_trip_ticket.driver,
				old_trip_ticket.equipment,
				old_trip_ticket.authorized_passengers,
				old_trip_ticket.places_to_visit,
				old_trip_ticket.purposes,
				old_trip_ticket.departure_time,
				old_trip_ticket.arrival_time_at_destination,
				old_trip_ticket.departure_time_from_destination,
				old_trip_ticket.arrival_time_back,
				old_trip_ticket.approximate_distance_traveled,
				old_trip_ticket.gasoline_balance_in_tank,
				old_trip_ticket.gasoline_issued_by_office,
				old_trip_ticket.gasoline_purchased,
				old_trip_ticket.gasoline_used,
				old_trip_ticket.gasoline_balance_end_trip,
				old_trip_ticket.gear_oil_issued_purchased,
				old_trip_ticket.lubricating_oil_issued_purchased,
				old_trip_ticket.grease_issued_purchased,
				old_trip_ticket.brake_fluid_issued_purchased,
				old_trip_ticket.speedometer_start,
				old_trip_ticket.speedometer_end,
				old_trip_ticket.distance_traveled,
				old_trip_ticket.remarks,
				old_trip_ticket.encoded_at,
				product.id as product_id,
				product.product,
				driver.id as driver_id,
				driver.first_name as driver_first_name,
				driver.last_name as driver_last_name,
				driver.middle_name as driver_middle_name,
				driver.suffix as driver_suffix,
				equipment.id as equipment_id,
				equipment.model,
				equipment.plate_number,
				equipment.fuel_capacity,
				equipment_type.tank_balance,
				equipment.office,
				equipment_type.times,
				office.id office_id,
				office.office,
				office.abbr,
				users.id user_id,
				users.first_name user_first_name,
				users.last_name user_last_name,
				users.middle_name user_middle_name,
				')
			->from('old_trip_ticket')
			->join('product', 'old_trip_ticket.product = product.id', 'LEFT')
			->join('driver', 'old_trip_ticket.driver = driver.id', 'LEFT')
			->join('equipment', 'old_trip_ticket.equipment = equipment.id', 'LEFT')
			->join('equipment_type', 'equipment.equipment_type = equipment_type.id', 'LEFT')
			->join('office', 'equipment.office = office.id', 'LEFT')
			->join('users', 'old_trip_ticket.user_id = users.id', 'LEFT')
			->where($data)
			->order_by('old_trip_ticket.purchase_date', 'desc');


		$query = $this->db->get();
		return $query->result();
	}
	public function get_summary_consumption($data)
	{

		$this->db
			->select('
				old_trip_ticket.id,
				old_trip_ticket.purchase_date,
				old_trip_ticket.driver,
				old_trip_ticket.equipment,
				old_trip_ticket.authorized_passengers,
				old_trip_ticket.places_to_visit,
				old_trip_ticket.purposes,
				old_trip_ticket.departure_time,
				old_trip_ticket.arrival_time_at_destination,
				old_trip_ticket.departure_time_from_destination,
				old_trip_ticket.arrival_time_back,
				old_trip_ticket.approximate_distance_traveled,
				old_trip_ticket.gasoline_balance_in_tank,
				old_trip_ticket.gasoline_issued_by_office,
				old_trip_ticket.gasoline_purchased,
				old_trip_ticket.unit_cost,
				old_trip_ticket.gasoline_used,
				old_trip_ticket.unit_cost,
				old_trip_ticket.gasoline_balance_end_trip,
				old_trip_ticket.gear_oil_issued_purchased,
				old_trip_ticket.lubricating_oil_issued_purchased,
				old_trip_ticket.grease_issued_purchased,
				old_trip_ticket.brake_fluid_issued_purchased,
				old_trip_ticket.speedometer_start,
				old_trip_ticket.speedometer_end,
				old_trip_ticket.distance_traveled,
				old_trip_ticket.remarks,
				old_trip_ticket.encoded_at,
				product.id as product_id,
				product.product,
				driver.id as driver_id,
				driver.first_name,
				driver.last_name,
				driver.middle_name,
				driver.suffix,
				equipment.id as equipment_id,
				equipment.model,
				equipment.plate_number,
				equipment.fuel_capacity,
				equipment.office,
				office.id office_id,
				office.office,
				office.abbr
				
				')
			->from('old_trip_ticket')
			->join('product', 'old_trip_ticket.product = product.id', 'LEFT')
			->join('driver', 'old_trip_ticket.driver = driver.id', 'LEFT')
			->join('equipment', 'old_trip_ticket.equipment = equipment.id', 'LEFT')
			->join('office', 'equipment.office = office.id', 'LEFT')
			->where($data)
			->order_by('old_trip_ticket.purchase_date,   driver.last_name asc');


		$query = $this->db->get();
		return $query->result();
	}


	public function get_product_summary_consumption($data)
	{

		$this->db
			->select('
				product.product, 
				sum(gasoline_purchased)  total_purchase,
        SUM(gasoline_purchased * unit_cost) AS total_unit_cost
				
				')
			->from('old_trip_ticket')
			->join('product', 'old_trip_ticket.product = product.id', 'LEFT')
			->where($data)
			->group_by('product.product');


		$query = $this->db->get();
		return $query->result();
	}



	public function get_driver_equipment($data)
	{

		$this->db
			->select(' 
				driver,
				equipment,
				driver.last_name,
				driver.first_name,
				driver.middle_name,
				driver.suffix,
				equipment.plate_number,
				equipment.model,
			')
			->from('old_trip_ticket')
			->join('driver', 'old_trip_ticket.driver = driver.id', 'LEFT')
			->join('equipment', 'old_trip_ticket.equipment = equipment.id', 'LEFT')
			->where('purchase_date >=', $data['start_date'])
			->where('purchase_date <=', $data['end_date'])
			->group_by('driver, equipment')
			->order_by('driver.last_name', 'asc');


		$query = $this->db->get();
		return $query->result();
	}



	public function get_driver_within_date_range($data)
	{

		$this->db
			->select('
				driver.id as driver_id,
				driver.first_name,
				driver.last_name,
				driver.middle_name,
				driver.suffix ')
			->distinct('old_trip_ticket.driver')
			->from('old_trip_ticket')
			->join('driver', 'old_trip_ticket.driver = driver.id', 'LEFT')
			->where('purchase_date >=', $data['start_date'])
			->where('purchase_date <=', $data['end_date'])
			->order_by('driver.last_name', 'asc');


		$query = $this->db->get();
		return $query->result();
	}


	public function get_driver_trip_ticket($data)
	{
		$this->db->select('
			old_trip_ticket.purposes,
			old_trip_ticket.purchase_date,
			old_trip_ticket.approximate_distance_traveled distance_traveled,
			old_trip_ticket.gasoline_purchased,
			old_trip_ticket.lubricating_oil_issued_purchased,
			old_trip_ticket.grease_issued_purchased,
		')
			->from('old_trip_ticket')
			->join('equipment', 'old_trip_ticket.equipment = equipment.id', 'LEFT')

			->where('purchase_date >=', $data['start_date'])
			->where('purchase_date <=', $data['end_date'])
			->where('old_trip_ticket.driver', $data['driver_id'])
			->where('old_trip_ticket.equipment', $data['equipment_id'])
			->order_by('purchase_date', 'ASC');

		$query = $this->db->get();
		// return $query;
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



	public function get_encoded_data()
	{

		$query_string = "
			SELECT users.id user_id,
			users.first_name,
			date( old_trip_ticket.`encoded_at`) as encoded_at, 
			COUNT(users.id) AS total_encoded
			FROM old_trip_ticket
			LEFT JOIN users ON old_trip_ticket.`user_id` = users.`id`
			GROUP BY users.id, DATE(old_trip_ticket.`encoded_at`)
			ORDER BY DATE(old_trip_ticket.`encoded_at`)
		";

		$query = $this->db->query($query_string);


		return $query->result();
	}

	public function get_date()
	{
		$query_string = " 
			SELECT
				distinct DATE(encoded_at) as date
			FROM old_trip_ticket
			order by date(encoded_at) asc
		";
		$query = $this->db
			->query($query_string);


		return $query->result();
	}


	public function get_work_details($data)
	{
		$this->db->select('COUNT(*) AS total')
			->from('old_trip_ticket')
			->join('users', 'old_trip_ticket.user_id = users.id', 'LEFT')
			->where($data);
		$query = $this->db->get();

		return $query->row();

	}

	public function get_driver($data)
	{

		$group_by = 'driver';

		if ($data['report_type'] == 1) {

			$group_by = 'driver, equipment';
		}

		$this->db
			->select(' 
				driver.id driver_id,
				driver.last_name,
				driver.first_name,
				driver.middle_name,
				driver.suffix,
				equipment.id equipment_id,
				equipment.plate_number,
				equipment.model,
			')
			->from('old_trip_ticket')
			->join('driver', 'old_trip_ticket.driver = driver.id', 'LEFT')
			->join('equipment', 'old_trip_ticket.equipment = equipment.id', 'LEFT')
			->join('report_type', 'equipment.report_type = report_type.id', 'LEFT')
			->where('purchase_date >=', $data['start_date'])
			->where('purchase_date <=', $data['end_date'])
			->where('report_type.id', $data['report_type'])
			->group_by($group_by)
			->order_by('driver.last_name', 'asc');

		$query = $this->db->get();
		return $query->result();
	}
	
	public function get_equipment($data)
	{
		$this->db
			->select('
				old_trip_ticket.purchase_date,
				old_trip_ticket.id,
				old_trip_ticket.equipment,
				old_trip_ticket.purposes,
				old_trip_ticket.lubricating_oil_issued_purchased,
				old_trip_ticket.distance_traveled,
				old_trip_ticket.grease_issued_purchased,
				old_trip_ticket.approximate_distance_traveled,
				equipment.model,
				equipment.include_description,
				equipment.plate_number,
				old_trip_ticket.departure_time,
				old_trip_ticket.arrival_time_at_destination,
				old_trip_ticket.departure_time_from_destination,
				old_trip_ticket.arrival_time_back,
				old_trip_ticket.gasoline_issued_by_office,
				old_trip_ticket.gasoline_purchased   
			')
			->from('old_trip_ticket')
			->join('driver', 'old_trip_ticket.driver = driver.id', 'LEFT')
			->join('equipment', 'old_trip_ticket.equipment = equipment.id', 'LEFT')
			->where($data)
			->order_by('old_trip_ticket.purchase_date asc')
		;


		$query = $this->db->get();
		return $query->result();
	}

	public function get_equipment_report_type_2($data)
	{
		$this->db
			->select('
				old_trip_ticket.purchase_date,
				old_trip_ticket.id,
				old_trip_ticket.equipment,
				old_trip_ticket.purposes,
				old_trip_ticket.lubricating_oil_issued_purchased,
				old_trip_ticket.distance_traveled,
				old_trip_ticket.grease_issued_purchased,
				old_trip_ticket.approximate_distance_traveled,
				equipment.model,
				equipment.include_description,
				equipment.plate_number,
				old_trip_ticket.departure_time,
				old_trip_ticket.arrival_time_at_destination,
				old_trip_ticket.departure_time_from_destination,
				old_trip_ticket.arrival_time_back,
				old_trip_ticket.gasoline_issued_by_office,
				old_trip_ticket.gasoline_purchased   
			')
			->from('old_trip_ticket')
			->join('driver', 'old_trip_ticket.driver = driver.id', 'LEFT')
			->join('equipment', 'old_trip_ticket.equipment = equipment.id', 'LEFT')

			->where($data)
			->group_by('equipment.id')
			->order_by('old_trip_ticket.purchase_date asc')
		;


		$query = $this->db->get();
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
					LEFT JOIN old_trip_ticket c
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
					old_trip_ticket c
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

	// need to update for old trip ticket
	public function get_previous_delivery_data($data)
	{

		$query = $this->db->where($data, $limit = 1)
			->order_by('date', 'desc')
			->limit($limit)
			->get('delivery');

		return $query->row();
	}



}
