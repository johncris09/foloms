<?php

defined('BASEPATH') or exit('No direct script access allowed');

class TripTicketModel extends CI_Model
{

	public $table = 'trip_ticket';

	public function __construct()
	{
		parent::__construct();
	}

	public function get()
	{
		$this->db
			->select('
				trip_ticket.id,
				trip_ticket.control_number,
				trip_ticket.purchase_date,
				trip_ticket.driver,
				trip_ticket.equipment,
				trip_ticket.authorized_passengers,
				trip_ticket.places_to_visit,
				trip_ticket.purposes,
				trip_ticket.departure_time,
				trip_ticket.arrival_time_at_destination,
				trip_ticket.departure_time_from_destination,
				trip_ticket.arrival_time_back,
				trip_ticket.approximate_distance_traveled,
				trip_ticket.gasoline_balance_in_tank,
				trip_ticket.gasoline_issued_by_office,
				trip_ticket.gasoline_purchased,
				trip_ticket.gasoline_used,
				trip_ticket.gasoline_balance_end_trip,
				trip_ticket.gear_oil_issued_purchased,
				trip_ticket.lubricating_oil_issued_purchased,
				trip_ticket.grease_issued_purchased,
				trip_ticket.brake_fluid_issued_purchased,
				trip_ticket.speedometer_start,
				trip_ticket.speedometer_end,
				trip_ticket.distance_traveled,
				trip_ticket.remarks,
				trip_ticket.encoded_at,
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
			->from('trip_ticket')
			->join('product', 'trip_ticket.product = product.id', 'LEFT')
			->join('driver', 'trip_ticket.driver = driver.id', 'LEFT')
			->join('equipment', 'trip_ticket.equipment = equipment.id', 'LEFT')
			->join('equipment_type', 'equipment.equipment_type = equipment_type.id', 'LEFT')
			->join('office', 'equipment.office = office.id', 'LEFT')
			->join('users', 'trip_ticket.user_id = users.id', 'LEFT')
			->order_by('trip_ticket.purchase_date', 'desc');


		$query = $this->db->get();
		return $query->result();
	}


	public function get_summary_consumption($data)
	{

		$this->db
			->select('
				trip_ticket.id,
				trip_ticket.control_number,
				trip_ticket.purchase_date,
				trip_ticket.driver,
				trip_ticket.equipment,
				trip_ticket.authorized_passengers,
				trip_ticket.places_to_visit,
				trip_ticket.purposes,
				trip_ticket.departure_time,
				trip_ticket.arrival_time_at_destination,
				trip_ticket.departure_time_from_destination,
				trip_ticket.arrival_time_back,
				trip_ticket.approximate_distance_traveled,
				trip_ticket.gasoline_balance_in_tank,
				trip_ticket.gasoline_issued_by_office,
				trip_ticket.gasoline_purchased,
				trip_ticket.unit_cost,
				trip_ticket.gasoline_used,
				trip_ticket.unit_cost,
				trip_ticket.gasoline_balance_end_trip,
				trip_ticket.gear_oil_issued_purchased,
				trip_ticket.lubricating_oil_issued_purchased,
				trip_ticket.grease_issued_purchased,
				trip_ticket.brake_fluid_issued_purchased,
				trip_ticket.speedometer_start,
				trip_ticket.speedometer_end,
				trip_ticket.distance_traveled,
				trip_ticket.remarks,
				trip_ticket.encoded_at,
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
			->from('trip_ticket')
			->join('product', 'trip_ticket.product = product.id', 'LEFT')
			->join('driver', 'trip_ticket.driver = driver.id', 'LEFT')
			->join('equipment', 'trip_ticket.equipment = equipment.id', 'LEFT')
			->join('office', 'equipment.office = office.id', 'LEFT')
			->where($data)
			->order_by('trip_ticket.purchase_date,   driver.last_name asc');


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
			->from('trip_ticket')
			->join('product', 'trip_ticket.product = product.id', 'LEFT')
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
			->from('trip_ticket')
			->join('driver', 'trip_ticket.driver = driver.id', 'LEFT')
			->join('equipment', 'trip_ticket.equipment = equipment.id', 'LEFT')
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
			->distinct('trip_ticket.driver')
			->from('trip_ticket')
			->join('driver', 'trip_ticket.driver = driver.id', 'LEFT')
			->where('purchase_date >=', $data['start_date'])
			->where('purchase_date <=', $data['end_date'])
			->order_by('driver.last_name', 'asc');


		$query = $this->db->get();
		return $query->result();
	}


	public function get_driver_trip_ticket($data)
	{
		$this->db->select('
			trip_ticket.purposes,
			trip_ticket.purchase_date,
			trip_ticket.approximate_distance_traveled distance_traveled,
			trip_ticket.gasoline_purchased,
			trip_ticket.lubricating_oil_issued_purchased,
			trip_ticket.grease_issued_purchased,
		')
			->from('trip_ticket')
			->join('equipment', 'trip_ticket.equipment = equipment.id', 'LEFT')

			->where('purchase_date >=', $data['start_date'])
			->where('purchase_date <=', $data['end_date'])
			->where('trip_ticket.driver', $data['driver_id'])
			->where('trip_ticket.equipment', $data['equipment_id'])
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
