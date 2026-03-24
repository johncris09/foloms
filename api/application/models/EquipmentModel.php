<?php

defined('BASEPATH') or exit('No direct script access allowed');

class EquipmentModel extends CI_Model
{

	public $table = 'equipment';

	public function __construct()
	{
		parent::__construct();
	}

	public function get()
	{
		$this->db
			->select('
				equipment.id,
				equipment.model,
				equipment.plate_number,
				equipment.fuel_capacity,
				equipment.include_description,
				office.id office_id,
				office.office,
				office.abbr,
				equipment_type.id   equipment_type_id,
				equipment_type.type,
				equipment_type.times,
				equipment_type.tank_balance, 
				report_type.id report_type_id, 
				report_type.type report_type,  
				report_type.description report_description, 
				')
			->from('equipment')
			->join('office', 'equipment.office = office.id', 'LEFT')
			->join('equipment_type', 'equipment.equipment_type = equipment_type.id', 'LEFT')
			->join('report_type', 'equipment.report_type = report_type.id', 'LEFT')
			->order_by('equipment.model');


		$query = $this->db->get();
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

	public function get_monthly_report($equipment_id, $year)
	{
		$sql = "
            SELECT 
                m.month_name AS Month,
                COALESCE(SUM(tt.gasoline_purchased + tt.gasoline_issued_by_office), 0) AS monthly_consumption,
                COALESCE(SUM(tt.unit_cost), 0) AS monthly_cost,
                COALESCE(SUM(tt.approximate_distance_traveled), 0) AS distance_travel,
                e.*
            FROM 
                (
                    SELECT 1 AS month_num, 'Jan' AS month_name UNION ALL
                    SELECT 2, 'Feb' UNION ALL
                    SELECT 3, 'Mar' UNION ALL
                    SELECT 4, 'Apr' UNION ALL
                    SELECT 5, 'May' UNION ALL
                    SELECT 6, 'Jun' UNION ALL
                    SELECT 7, 'Jul' UNION ALL
                    SELECT 8, 'Aug' UNION ALL
                    SELECT 9, 'Sep' UNION ALL
                    SELECT 10, 'Oct' UNION ALL
                    SELECT 11, 'Nov' UNION ALL
                    SELECT 12, 'Dec'
                ) m
            LEFT JOIN trip_ticket tt 
                ON m.month_num = MONTH(tt.purchase_date)
                AND YEAR(tt.purchase_date) = ?
                AND tt.equipment = ?
            LEFT JOIN equipment e 
                ON e.id = ?
            GROUP BY m.month_num
            ORDER BY m.month_num
        ";

		return $this->db->query($sql, [$year, $equipment_id, $equipment_id])->result_array();
	}
	public function get_all_monthly_reports($year, $equipment_id = null)
	{
		// Build SQL query
		$this->db->select("
            e.id AS equipment_id,
            e.model,
            e.plate_number,
            e.fuel_capacity,
            office.abbr as abbr,
            office.office as office,
			equipment_type.type AS equipment_type,
			equipment_type.times,
			equipment_type.tank_balance,
            e.include_description,
            e.report_type,
            MONTH(tt.purchase_date) AS month_num,
            COALESCE(SUM(tt.gasoline_purchased + tt.gasoline_issued_by_office), 0) AS monthly_consumption,
            COALESCE(SUM(tt.unit_cost), 0) AS monthly_cost,
            COALESCE(SUM(tt.approximate_distance_traveled), 0) AS distance_travel
        ");
		$this->db->from('equipment e');
		$this->db->join('trip_ticket tt', "tt.equipment = e.id AND YEAR(tt.purchase_date) = {$this->db->escape_str($year)}", 'left');

		$this->db->join('office', 'e.office = office.id', 'left');
		$this->db->join('equipment_type', 'e.equipment_type = equipment_type.id', 'left');
		if ($equipment_id) {
			$this->db->where('e.id', $equipment_id);
		}

		$this->db->group_by(['e.id', 'month_num']);
		$this->db->order_by('e.id, month_num');

		$query = $this->db->get();
		$rows = $query->result_array();

		// Structure into final JSON
		$finalData = [];
		$equipmentsMap = [];

		foreach ($rows as $row) {
			$eid = $row['equipment_id'];

			// Initialize equipment if not exists
			if (!isset($equipmentsMap[$eid])) {
				$equipmentsMap[$eid] = [
					'id' => $row['equipment_id'],
					'model' => $row['model'],
					'plate_number' => $row['plate_number'],
					'fuel_capacity' => $row['fuel_capacity'],
					'abbr' => $row['abbr'],
					'office' => $row['office'],
					'equipment_type' => $row['equipment_type'],
					'tank_balance' => $row['tank_balance'],
					'include_description' => $row['include_description'],
					'report_type' => $row['report_type'],
					'monthly_report' => []
				];
			}

			// Prepare monthly array with defaults
			for ($m = 1; $m <= 12; $m++) {
				if (!isset($equipmentsMap[$eid]['monthly_report'][$m])) {
					$equipmentsMap[$eid]['monthly_report'][$m] = [
						'month' => date('M', mktime(0, 0, 0, $m, 1)),
						'monthly_consumption' => 0,
						'monthly_cost' => 0,
						'distance_travel' => 0
					];
				}
			}

			// Fill month data if exists
			if ($row['month_num']) {
				$equipmentsMap[$eid]['monthly_report'][$row['month_num']] = [
					'month' => date('M', mktime(0, 0, 0, $row['month_num'], 1)),
					'monthly_consumption' => (float) $row['monthly_consumption'],
					'monthly_cost' => (float) $row['monthly_cost'],
					'distance_travel' => (float) $row['distance_travel']
				];
			}
		}

		// Convert to indexed array and reset keys for monthly_report
		foreach ($equipmentsMap as &$equipment) {
			$equipment['monthly_report'] = array_values($equipment['monthly_report']);
			$finalData[] = $equipment;
		}

		return $finalData;
	}
}
