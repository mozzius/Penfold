#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use tauri::State;

mod email;

#[derive(Debug)]
struct Database(String);

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
async fn get_email<'r>(database: State<'r, Database>, account: i64) -> Result<String, String> {
    let details = email::connect(&database.0.clone(), account).await;
    let body = email::get_emails(&database.0.clone(), details)
        .await
        .unwrap();
    if let Some(body) = body {
        Ok(body)
    } else {
        Err("No email found".to_string())
    }
}

fn main() {
    let path = tauri::api::path::data_dir()
        .unwrap()
        .to_str()
        .unwrap()
        .to_string();
    // TODO: find a better way than hardcoding this!
    let db = format!("sqlite:{}/com.penfold.dev/emails.db", path);
    tauri::Builder::default()
        .manage(Database(db))
        .plugin(tauri_plugin_sql::Builder::default().build())
        .invoke_handler(tauri::generate_handler![get_email])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
