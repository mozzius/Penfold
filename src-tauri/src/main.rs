#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod email;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
async fn get_email(account: i32) -> String {
    let details = email::connect(account).await;
    let body = email::get_emails(details).unwrap();
    body.unwrap()
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_sql::Builder::default().build())
        .invoke_handler(tauri::generate_handler![get_email])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
