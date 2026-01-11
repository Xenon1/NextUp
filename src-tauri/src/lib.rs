#[tauri::command]
fn get_config_path() -> Result<String, String> {
  let data_dir = get_data_dir();
  let config_path = data_dir.join("config.json");
  
  Ok(config_path.to_string_lossy().to_string())
}

fn get_data_dir() -> std::path::PathBuf {
  use std::path::PathBuf;
  
  // Check for NEXTUP_DATA_DIR environment variable (for testing)
  if let Ok(custom_dir) = std::env::var("NEXTUP_DATA_DIR") {
    return PathBuf::from(custom_dir);
  }
  
  // Default to ~/.nextup
  let home_dir = PathBuf::from(
    std::env::var("USERPROFILE").unwrap_or_else(|_| ".".to_string())
  );
  home_dir.join(".nextup")
}

#[tauri::command]
fn read_config() -> Result<String, String> {
  use std::fs;
  
  let data_dir = get_data_dir();
  let config_path = data_dir.join("config.json");
  
  if !config_path.exists() {
    return Err("Config file not found".to_string());
  }
  
  fs::read_to_string(config_path).map_err(|e| e.to_string())
}

#[tauri::command]
fn write_config(content: String) -> Result<String, String> {
  use std::fs;
  
  let data_dir = get_data_dir();
  
  // Create directory if it doesn't exist
  fs::create_dir_all(&data_dir).map_err(|e| e.to_string())?;
  
  let config_path = data_dir.join("config.json");
  fs::write(config_path, content).map_err(|e| e.to_string())?;
  
  Ok("Config saved successfully".to_string())
}

#[tauri::command]
fn save_watchlist(data: String) -> Result<String, String> {
  use std::fs;
  
  let data_dir = get_data_dir();
  
  // Create directory if it doesn't exist
  fs::create_dir_all(&data_dir).map_err(|e| e.to_string())?;
  
  let file_path = data_dir.join("watchlist.json");
  fs::write(file_path, data).map_err(|e| e.to_string())?;
  
  Ok("Saved successfully".to_string())
}

#[tauri::command]
fn load_watchlist() -> Result<String, String> {
  use std::fs;
  
  let data_dir = get_data_dir();
  let file_path = data_dir.join("watchlist.json");
  
  if !file_path.exists() {
    return Ok("[]".to_string());
  }
  
  fs::read_to_string(file_path).map_err(|e| e.to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .plugin(tauri_plugin_shell::init())
    .invoke_handler(tauri::generate_handler![save_watchlist, load_watchlist, get_config_path, read_config, write_config])
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
