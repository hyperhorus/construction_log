-- Daily Logs Table
CREATE TABLE IF NOT EXISTS Daily_Logs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT,
    date DATE,
    weather VARCHAR(191),
    work_performed TEXT,
    workers_count INT,
    notes TEXT,
    gps_location VARCHAR(191),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_project (project_id),
    INDEX idx_date (date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;