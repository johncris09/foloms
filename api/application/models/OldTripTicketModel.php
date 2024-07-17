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



}
