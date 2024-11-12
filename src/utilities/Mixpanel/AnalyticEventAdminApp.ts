export enum AdminPageEvents {
  //loginPage
  USER_SIGN_IN_SUCCESS = "user_sign_in_success",

  //photo addition
  ADMIN_APP_HOME_PAGE_ADD_ICON_CLICKED = "admin_app__home_page_add_icon_clicked",
  ADMIN_APP_HOME_PAGE_IMAGE_UPLOAD_SUCCESS = "admin_app__home_page_image_upload_success",
  ADMIN_APP_HOME_PAGE_EDIT_ICON_CLICKED = "admin_app__home_page_edit_icon_clicked",
  ADMIN_APP_HOME_PAGE_DELETE_BUTTON_CLICKED = "admin_app__home_page_delete_button_clicked",
  ADMIN_APP_HOME_PAGE_NEXT_ICON_CLICKED = "admin_app__home_page_next_icon_clicked",
  ADMIN_APP_HOME_PAGE_BACK_ICON_CLICKED = "admin_app__home_page_back_icon_clicked",

  //notice
  ADMIN_APP_HOME_PAGE_ADD_NOTICE_BUTTON_CLICKED = "admin_app__home_page_add_notice_button_clicked",
  ADMIN_APP_HOME_PAGE_SUBMIT_BUTTON_CLICKED = "admin_app__home_page_submit_button_clicked",
  ADMIN_APP_HOME_PAGE_NOTICE_CREATED_SUCCESS = "admin_app__home_page_notice_created_success",
  ADMIN_APP_HOME_PAGE_CANCEL_BUTTON_CLICKED = "admin_app__home_page_cancel_icon_clicked",
  ADMIN_APP_HOME_PAGE_NOTICE_CLICKED = "admin_app__home_page_notice_clicked",
  ADMIN_APP_HOME_PAGE_DELETE_ICON_CLICK = "admin_app__home_page_delete_icon_click",
  ADMIN_APP_HOME_PAGE_DELETE_NOTICE_SUCCESS = "admin_app__home_page_delete_notice_success",

  //result
  ADMIN_APP_HOME_PAGE_RESULT_CLICKED = "admin_app_home_page_result_clicked",
  ADMIN_APP_RESULT_PAGE_CLASS_CLICKED = "admin_app_result_page_class_clicked",
  ADMIN_APP_RESULT_PAGE_ALL_CLICK = "admin_app_result_page_all_click",
  ADMIN_APP_RESULT_PAGE_SUBJECT_CLICK = "admin_app_result_page_subject_click",
  ADMIN_APP_RESULT_PAGE_ADD_ICON_CLICK = "admin_app_result_page_add_icon_click",
  ADMIN_APP_RESULT_PAGE_CANCEL_BUTTON_CLICK = "admin_app_result_page_cancel_button_click",
  ADMIN_APP_RESULT_PAGE_NEXT_BUTTON_CLICK = "admin_app_result_page_next_button_click",

  //students
  ADMIN_APP_HOME_PAGE_STUDENTS_CLICKED = "admin_app_home_page_students_clicked",
  ADMIN_APP_STUDENTS_PAGE_CLASS_CLICK = "admin_app_students_page_class_click",
  ADMIN_APP_STUDENTS_PAGE_ADD_ICON_CLICK = "admin_app_students_page_add_icon_click",
  ADMIN_APP_STUDENTS_PAGE_SUBMIT_BUTTON_CLICK = "admin_app_students_page_submit_button_click",
  ADMIN_APP_STUDENTS_PAGE_STUDENT_ADDED_SUCCESS = "admin_app_students_page_student_added_success",
  
  ADMIN_APP_STUDENTS_PAGE_MESSAGE_ICON_CLICK = "admin_app_students_page_message_icon_click",
  ADMIN_APP_STUDENTS_PAGE_CANCEL_BUTTON_CLICK = "admin_app_students_page_cancel_button_click",
  ADMIN_APP_STUDENTS_PAGE_UPDATE_BUTTON_CLICK = "admin_app_students_page_update_button_click",
  ADMIN_APP_STUDENTS_PAGE_CANCEL_ICON_CLICK = "admin_app_students_page_cancel_icon_click",
  ADMIN_APP_STUDENTS_PAGE_BACK_ICON_CLICK = "admin_app_students_page_back_icon_click",

  //teachers
  ADMIN_APP_HOME_PAGE_TEACHERS_CLICKED = "admin_app_home_page_teachers_clicked",
  ADMIN_APP_TEACHERS_PAGE_CLASS_CLICK = "admin_app_teachers_page_class_click",
  ADMIN_APP_TEACHERS_PAGE_ADD_ICON_CLICK = "admin_app_teachers_page_add_icon_click",
  ADMIN_APP_TEACHERS_PAGE_SUBMIT_BUTTON_CLICK = "admin_app_teachers_page_submit_button_click",
  ADMIN_APP_TEACHERS_PAGE_TEACHER_ADDED_SUCCESS = "admin_app_teachers_page_teacher_added_success",
  
  ADMIN_APP_TEACHERS_PAGE_MESSAGE_ICON_CLICK = "admin_app_teachers_page_message_icon_click",
  ADMIN_APP_TEACHERS_PAGE_CANCEL_BUTTON_CLICK = "admin_app_teachers_page_cancel_button_click",
  ADMIN_APP_TEACHERS_PAGE_UPDATE_BUTTON_CLICK = "admin_app_teachers_page_update_button_click",
  ADMIN_APP_TEACHERS_PAGE_CANCEL_ICON_CLICK = "admin_app_teachers_page_cancel_icon_click",
  ADMIN_APP_TEACHERS_PAGE_BACK_ICON_CLICK = "admin_app_teachers_page_back_icon_click",

  //doubts
  ADMIN_APP_HOME_PAGE_DOUBTS_CLICKED = "admin_app_home_page_doubts_clicked",
  ADMIN_APP_DOUBTS_PAGE_REPLY_BUTTON_CLICK = "admin_app_doubts_page_reply_button_click",
  ADMIN_APP_DOUBTS_PAGE_CANCEL_BUTTON_CLICK = "admin_app_doubts_page_cancel_button_click",
  ADMIN_APP_DOUBTS_PAGE_SEND_BUTTON_CLICK = "admin_app_doubts_page_send_button_click",
  ADMIN_APP_DOUBTS_PAGE_MESSAGE_SEND_SUCCESS = "admin_app_doubts_page_message_send_success",

  //logout
  ADMIN_APP_HOME_PAGE_NAME_ICON_CLICKED = "admin_app_home_page_name_icon_clicked",
  ADMIN_APP_HOME_PAGE_LOGOUT_SUCCESS = "admin_app_home_page_logout_success",

  //Admin hub
  ADMIN_APP_HOME_PAGE_ADMIN_HUB_CLICKED = "admin_app_home_page_admin_hub_clicked",
  ADMIN_APP_ADMIN_HUB_PAGE_DROP_DOWN_CLICK = "admin_app_admin_hub_page_drop_down_click",
  ADMIN_APP_ADMIN_HUB_CLASS_CLICK = "admin_app_admin_hub_class_click",
}
