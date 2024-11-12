export enum WebAppEvents {
  //at start events
  VIGNAM_APP_LAUNCHED = "vignam_app_launched",
  VIGNAM_APP_LOGIN_PAGE_ACCESSED = "vignam_app_login_page_accessed",
  VIGNAM_APP_LOGIN_USER_TYPE_DROP_DOWN_CLICKED = "vignam_app_login_user_type_drop_down_clicked",
  VIGNAM_APP_LOGIN_BUTTON_CLICKED = "vignam_app_login_button_clicked",
  USER_SIGN_IN_FAILED = "user_sign_in_failed",
  NEW_USER_ID_CREATED = "new_user_id_created",

  //home page
  TEACHER_APP_HOME_PAGE_ACCESSED = "teacher_app_home_page_accessed",
  TEACHER_APP_SELECTION_PAGE_ACCESSED = "teacher_app_selection_page_accessed",

  //simulations list page
  TEACHER_APP_SHOW_ALL_SIMULATIONS_CLICKED = "teacher_app_show_all_simulations_clicked",
  TEACHER_APP_SIMULATION_LIST_PAGE_ACCESSED = "teacher_app_simulation_list_page_accessed",
  TEACHER_APP_SIMULATION_PAGE_SIMULATION_CLICKED = "teacher_app_simulation_page_simulation_clicked",
  TEACHER_APP_SIMULATION_PAGE_FILTER_CLICKED = "teacher_app_simulation_page_filter_clicked",
  TEACHER_APP_SIMULATION_PAGE_SEARCH_TYPED = "teacher_app_simulation_page_search_typed",

  TEACHER_APP_ACTIVE_SIMULATION_CLICKED = "teacher_app_active_simulation_clicked",

  //LTP
  TEACHER_APP_PRACTICE_CLICKED = "teacher_app_practice_clicked",
  TEACHER_APP_TEST_CLICKED = "teacher_app_test_clicked",
  TEACHER_APP_LEARN_CLICKED = "teacher_app_learn_clicked",
  TEACHER_APP_VIGNAM_LOGO_CLICKED = "teacher_app_vignam_logo_clicked",
  TEACHER_APP_CHAPTER_SELECTION_CLICKED = "teacher_app_chapter_selection_clicked",
  TEACHER_APP_NEW_CHAPTER_CLICKED = "teacher_app_new_chapter_clicked",
  TEACHER_APP_TOPIC_CLICKED = "teacher_app_topic_clicked",

  TEACHER_APP_SUBJECT_CARD_CLICKED = "teacher_app_subject_card_clicked",
  TEACHER_APP_CHAPTER_CARD_CLICKED = "teacher_app_chapter_card_clicked",

  TEACHER_APP_HIGHLIGHTER_CLICKED = "teacher_app_highlighter_clicked",
  TEACHER_APP_MARKER_CLICKED = "teacher_app_marker_clicked",
  TEACHER_APP_ERASER_CLICKED = "teacher_app_eraser_clicked",
  TEACHER_APP_WHITEBOARD_ACCESSED = "teacher_app_whiteboard_accessed",

  //resources section
  TEACHER_APP_LEARN_PAGE_RESOURCES_CLICKED = "teacher_app_learn_page_resources_clicked",
  TEACHER_APP_LEARN_PAGE_TOPIC_DROPDOWN_CLICKED = "teacher_app_learn_page_topic_dropdown_clicked",
  TEACHER_APP_LEARN_PAGE_SIMULATION_ICON_CLICKED = "teacher_app_learn_page_simulation_icon_clicked",
  TEACHER_APP_LEARN_PAGE_MINDMAP_ICON_CLICKED = "teacher_app_learn_page_mindmap_icon_clicked",
  TEACHER_APP_LEARN_PAGE_QUESTIONS_BANK_ICON_CLICKED = "teacher_app_learn_page_questions_icon_clicked",
  TEACHER_APP_LEARN_PAGE_RESOURCES_ICON_CLICKED = "teacher_app_learn_page_resources_icon_clicked",
  TEACHER_APP_LEARN_PAGE_FILE_CLICKED = "teacher_app_learn_page_file_clicked",
  TEACHER_APP_LEARN_PAGE_ADD_FILES_BUTTON_CLICKED = "teacher_app_learn_page_add_files_button_clicked",
  TEACHER_APP_LEARN_PAGE_TEST_SECTION_FILTER_DROPDOWN_CLICKED = "teacher_app_learn_page_test_section_filter_dropdown_clicked",
  TEACHER_APP_LEARN_PAGE_RESOURCES_SECTION_FILTER_DROPDOWN_CLICKED = "teacher_app_learn_page_resources_section_filter_dropdown_clicked",
  TEACHER_APP_PRACTICE_PAGE_RESOURCES_FILTER_CLICKED = "teacher_app_practice_page_question_filter_clicked",
  VIGNAM_APP_GO_PREMIUM_CLICKED = "vignam_app_go_premium_clicked",
  TEACHER_APP_SEARCH_CLICKED = "teacher_app_search_clicked",
  TEACHER_APP_LEARN_PAGE_SIMULATION_CLICKED = "teacher_app_learn_page_simulation_clicked",
  TEACHER_APP_SEARCH_ITEM_CLICKED = "teacher_app_search_item_clicked",

  //topic section
  TEACHER_APP_LEARN_PAGE_TOPIC_SECTION_ADD_SIMULATION_CLICKED = "teacher_app_learn_page_topic_section_add_simulation_clicked",
  TEACHER_APP_LEARN_PAGE_TOPIC_SECTION_SIMULATION_SELECTION_PANEL_SEARCH_TAB_CLICKED = "teacher_app_learn_page_topic_section_simulation_selection_panel_search_tab_clicked",
  TEACHER_APP_LEARN_PAGE_SIMULATION_SELECTION_PANEL_SEARCH_QUERY_TYPED = "teacher_app_learn_page_simulation_selection_panel_search_query_typed",
  TEACHER_APP_ADD_SIMULATION_SIMULATION_SELECTED = "teacher_app_add_simulation_simulation_selected",
  TEACHER_APP_LEARN_PAGE_SIMULATION_SELECTION_PANEL_DONE_BUTTON_CLICKED = "teacher_app_learn_page_simulation_selection_panel_done_button_clicked",
  TEACHER_APP_LEARN_PAGE_ACTIVE_SIMULATION_CLICKED = "teacher_app_learn_page_active_simulation_clicked",
  TEACHER_APP_LEARN_PAGE_CLOSE_SIMULATION_CLICKED = "teacher_app_learn_page_close_simulation_clicked",
  TEACHER_APP_LEARN_PAGE_FULLSCREEN_CLICKED = "teacher_app_learn_page_fullscreen_clicked",
  TEACHER_APP_LEARN_PAGE_EDIT_THEORY_CLICKED = "teacher_app_learn_page_edit_theory_clicked",
  TEACHER_APP_LEARN_PAGE_EDIT_THEORY_DIALOG_BOX_NEW_THEORY_TYPED = "teacher_app_learn_page_edit_theory_dialog_box_new_theory_typed",
  TEACHER_APP_LEARN_PAGE_EDIT_THEORY_DIALOG_BOX_SUBMIT_CLICKED = "teacher_app_learn_page_edit_theory_dialog_box_submit_clicked",
  TEACHER_APP_LEARN_PAGE_SHARE_CLICKED = "teacher_app_learn_page_share_clicked",
  TEACHER_APP_LEARN_PAGE_SHARE_DIALOG_BOX_COPY_LINK_CLICKED = "teacher_app_learn_page_share_dialog_box_copy_link_clicked",
  TEACHER_APP_LEARN_PAGE_ADD_VIDEOS_CLICKED = "teacher_app_learn_page_add_videos_clicked",
  TEACHER_APP_LEARN_PAGE_VIDEOS_DIALOG_BOX_LINK_ADDED = "teacher_app_learn_page_videos_dialog_box_link_added",
  TEACHER_APP_LEARN_PAGE_VIDEOS_DIALOG_BOX_SUBMIT_CLICKED = "teacher_app_learn_page_videos_dialog_box_submit_clicked",
  TEACHER_APP_LEARN_PAGE_THEORY_SECTION_ACCESSED = "teacher_app_learn_page_theory_section_accessed",
  TEACHER_APP_LEARN_PAGE_VIDEOS_SECTION_ACCESSED = "teacher_app_learn_page_videos_section_accessed",
  TEACHER_APP_LEARN_PAGE_SIMULATION_SECTION_ACCESSED = "teacher_app_learn_page_simulation_section_accessed",

  //notes section
  TEACHER_APP_LEARN_PAGE_NOTES_SECTION_ACCESSED = "teacher_app_learn_page_notes_section_accessed",
  TEACHER_APP_LEARN_PAGE_NOTES_SECTION_BROWSE_CLICKED = "teacher_app_learn_page_notes_section_browse_clicked",
  TEACHER_APP_LEARN_PAGE_NOTES_SECTION_FILE_ADDED = "teacher_app_learn_page_notes_section_file_added",
  TEACHER_APP_LEARN_PAGE_NOTES_SECTION_NEW_FILE_CLICKED = "teacher_app_learn_page_notes_section_new_file_clicked",
  TEACHER_APP_LEARN_PAGE_NOTES_SECTION_HIGHLIGHTER_CLICKED = "teacher_app_learn_page_notes_section_highlighter_clicked",
  TEACHER_APP_LEARN_PAGE_NOTES_SECTION_MARKER_CLICKED = "teacher_app_learn_page_notes_section_marker_clicked",
  TEACHER_APP_LEARN_PAGE_NOTES_SECTION_ERASER_CLICKED = "teacher_app_learn_page_notes_section_eraser_clicked",
  TEACHER_APP_LEARN_PAGE_NOTES_SECTION_WHITEBOARD_ACCESSED = "teacher_app_learn_page_notes_section_whiteboard_accessed",

  //syllabus section
  TEACHER_APP_LEARN_PAGE_SYLLABUS_CLICKED = "teacher_app_learn_page_syllabus_clicked",
  TEACHER_APP_LEARN_PAGE_SYLLABUS_SECTION_HIGHLIGHTER_CLICKED = "teacher_app_learn_page_syllabus_section_highlighter_clicked",
  TEACHER_APP_LEARN_PAGE_SYLLABUS_SECTION_MARKER_CLICKED = "teacher_app_learn_page_syllabus_section_marker_clicked",
  TEACHER_APP_LEARN_PAGE_SYLLABUS_SECTION_ERASER_CLICKED = "teacher_app_learn_page_syllabus_section_eraser_clicked",
  TEACHER_APP_LEARN_PAGE_SYLLABUS_SECTION_WHITEBOARD_ACCESSED = "teacher_app_learn_page_syllabus_section_whiteboard_accessed",

  //Lesson plan section
  TEACHER_APP_LEARN_PAGE_LESSON_PLAN_CLICKED = "teacher_app_learn_page_lesson_plan_clicked",
  TEACHER_APP_LEARN_PAGE_LESSON_PLAN_SECTION_BROWSE_CLICKED = "teacher_app_learn_page_lesson_plan_section_browse_clicked",
  TEACHER_APP_LEARN_PAGE_LESSON_PLAN_SECTION_FILE_ADDED = "teacher_app_learn_page_lesson_plan_section_file_added",
  TEACHER_APP_LEARN_PAGE_LESSON_PLAN_SECTION_NEW_FILE_CLICKED = "teacher_app_learn_page_lesson_plan_section_new_file_clicked",
  TEACHER_APP_LEARN_PAGE_LESSON_PLAN_SECTION_HIGHLIGHTER_CLICKED = "teacher_app_learn_page_lesson_plan_section_highlighter_clicked",
  TEACHER_APP_LEARN_PAGE_LESSON_PLAN_SECTION_MARKER_CLICKED = "teacher_app_learn_page_lesson_plan_section_marker_clicked",
  TEACHER_APP_LEARN_PAGE_LESSON_PLAN_SECTION_ERASER_CLICKED = "teacher_app_learn_page_lesson_plan_section_eraser_clicked",
  TEACHER_APP_LEARN_PAGE_LESSON_PLAN_SECTION_WHITEBOARD_ACCESSED = "teacher_app_learn_page_lesson_plan_section_whiteboard_accessed",

  //All simulations section
  TEACHER_APP_LEARN_PAGE_ALL_SIMULATIONS_CLICKED = "teacher_app_learn_page_all_simulations_clicked",

  //Introduction Section
  TEACHER_APP_LEARN_PAGE_INTRODUCTION_CLICKED = "teacher_app_learn_page_introduction_clicked",
  TEACHER_APP_LEARN_PAGE_INTRODUCTION_SECTION_HIGHLIGHTER_CLICKED = "teacher_app_learn_page_introduction_section_highlighter_clicked",
  TEACHER_APP_LEARN_PAGE_INTRODUCTION_SECTION_MARKER_CLICKED = "teacher_app_learn_page_introduction_section_marker_clicked",
  TEACHER_APP_LEARN_PAGE_INTRODUCTION_SECTION_ERASER_CLICKED = "teacher_app_learn_page_introduction_section_eraser_clicked",
  TEACHER_APP_LEARN_PAGE_INTRODUCTION_SECTION_WHITEBOARD_ACCESSED = "teacher_app_learn_page_introduction_section_whiteboard_accessed",

  //summary section
  TEACHER_APP_LEARN_PAGE_SUMMARY_CLICKED = "teacher_app_learn_page_summary_clicked",
  TEACHER_APP_LEARN_PAGE_SUMMARY_SECTION_HIGHLIGHTER_CLICKED = "teacher_app_learn_page_summary_section_highlighter_clicked",
  TEACHER_APP_LEARN_PAGE_SUMMARY_SECTION_MARKER_CLICKED = "teacher_app_learn_page_summary_section_marker_clicked",
  TEACHER_APP_LEARN_PAGE_SUMMARY_SECTION_ERASER_CLICKED = "teacher_app_learn_page_summary_section_eraser_clicked",
  TEACHER_APP_LEARN_PAGE_SUMMARY_SECTION_WHITEBOARD_ACCESSED = "teacher_app_learn_page_summary_section_whiteboard_accessed",

  //mindmap section
  TEACHER_APP_LEARN_PAGE_MIND_MAPS_CLICKED = "teacher_app_learn_page_mind_maps_clicked",
  TEACHER_APP_LEARN_PAGE_MIND_MAP_SECTION_HIGHLIGHTER_CLICKED = "teacher_app_learn_page_mind_map_section_highlighter_clicked",
  TEACHER_APP_LEARN_PAGE_MIND_MAP_SECTION_MARKER_CLICKED = "teacher_app_learn_page_mind_map_section_marker_clicked",
  TEACHER_APP_LEARN_PAGE_MIND_MAP_SECTION_ERASER_CLICKED = "teacher_app_learn_page_mind_map_section_eraser_clicked",
  TEACHER_APP_LEARN_PAGE_MIND_MAP_SECTION_WHITEBOARD_ACCESSED = "teacher_app_learn_page_mind_map_section_whiteboard_accessed",
  TEACHER_APP_LEARN_PAGE_ADD_MORE_EXAMPLES_CLICKED = "teacher_app_learn_page_add_more_examples_clicked",
  TEACHER_APP_LEARN_PAGE_THEORY_LEVEL_CHANGED = "teacher_app_learn_page_theory_level_changed",

  //Practice page
  TEACHER_APP_PRACTICE_PAGE_LEARN_CLICKED = "teacher_app_practice_page_learn_clicked",
  TEACHER_APP_PRACTICE_PAGE_TEST_CLICKED = "teacher_app_practice_page_test_clicked",
  TEACHER_APP_PRACTICE_PAGE_ACCESSED = "teacher_app_practice_page_accessed",
  TEACHER_APP_PRACTICE_PAGE_VIGNAM_LOGO_CLICKED = "teacher_app_practice_page_vignam_logo_clicked",
  TEACHER_APP_PRACTICE_PAGE_SEARCH_TAB_CLICKED = "teacher_app_practice_page_search_tab_clicked",
  TEACHER_APP_PRACTICE_PAGE_SEARCH_QUERY_TYPED = "teacher_app_practice_page_search_query_typed",
  TEACHER_APP_PRACTICE_PAGE_QUESTION_FILTER_CLICKED = "teacher_app_practice_page_question_filter_clicked",
  TEACHER_APP_PRACTICE_PAGE_ADD_QUESTION_CLICKED = "teacher_app_practice_page_add_question_clicked",
  TEACHER_APP_PRACTICE_PAGE_QUESTION_TYPE_SELECTED = "teacher_app_practice_page_question_type_selected",
  TEACHER_APP_PRACTICE_PAGE_SUBMIT_CLICKED = "teacher_app_practice_page_submit_clicked",
  TEACHER_APP_PRACTICE_PAGE_TOPIC_CHANGED = "teacher_app_practice_page_topic_changed",

  //worksheet section
  TEACHER_APP_PRACTICE_PAGE_WORKSHEET_SECTION_ACCESSED = "teacher_app_practice_page_worksheet_section_accessed",
  TEACHER_APP_PRACTICE_PAGE_WORKSHEET_SECTION_BROWSE_CLICKED = "teacher_app_practice_page_worksheet_section_browse_clicked",
  TEACHER_APP_PRACTICE_PAGE_WORKSHEET_SECTION_FILE_ADDED = "teacher_app_practice_page_worksheet_section_file_added",
  TEACHER_APP_PRACTICE_PAGE_WORKSHEET_SECTION_NEW_FILE_CLICKED = "teacher_app_practice_page_worksheet_section_new_file_clicked",
  TEACHER_APP_PRACTICE_PAGE_WORKSHEET_SECTION_HIGHLIGHTER_CLICKED = "teacher_app_practice_page_worksheet_section_highlighter_clicked",
  TEACHER_APP_PRACTICE_PAGE_WORKSHEET_SECTION_MARKER_CLICKED = "teacher_app_practice_page_worksheet_section_marker_clicked",
  TEACHER_APP_PRACTICE_PAGE_WORKSHEET_SECTION_ERASER_CLICKED = "teacher_app_practice_page_worksheet_section_eraser_clicked",
  TEACHER_APP_PRACTICE_PAGE_WORKSHEET_SECTION_WHITEBOARD_ACCESSED = "teacher_app_practice_page_worksheet_section_whiteboard_accessed",

  //test page
  TEACHER_APP_TEST_PAGE_LEARN_CLICKED = "teacher_app_test_page_learn_clicked",
  TEACHER_APP_TEST_PAGE_TEST_CLICKED = "teacher_app_test_page_test_clicked",
  TEACHER_APP_TEST_PAGE_ACCESSED = "teacher_app_test_page_accessed",
  TEACHER_APP_TEST_PAGE_VIGNAM_LOGO_CLICKED = "teacher_app_test_page_vignam_logo_clicked",
  TEACHER_APP_TEST_PAGE_CREATE_TEST_CLICKED = "teacher_app_test_page_create_test_clicked",
  TEACHER_APP_TEST_PAGE_CHAPTERS_SELECTED = "teacher_app_test_page_chapters_selected",
  TEACHER_APP_TEST_PAGE_TOPICS_SELECTED = "teacher_app_test_page_topics_selected",
  TEACHER_APP_TEST_PAGE_QUESTIONS_SELECTED = "teacher_app_test_page_questions_selected",
  TEACHER_APP_TEST_PAGE_BASIC_SETTINGS_TEST_NAME_TYPED = "teacher_app_test_page_basic_settings_test_name_typed",
  TEACHER_APP_TEST_PAGE_BASIC_SETTINGS_TEST_DATE_SELECTED = "teacher_app_test_page_basic_settings_test_date_selected",
  TEACHER_APP_TEST_PAGE_BASIC_SETTINGS_TEST_TIME_SELECTED = "teacher_app_test_page_basic_settings_test_time_selected",
  TEACHER_APP_TEST_PAGE_BASIC_SETTINGS_QUESTION_NUMBER_SELECTED = "teacher_app_test_page_basic_settings_question_number_selected",
  TEACHER_APP_TEST_PAGE_BASIC_SETTINGS_MAXIMUM_MARKS_SELECTED = "teacher_app_test_page_basic_settings_maximum_marks_selected",
  TEACHER_APP_TEST_PAGE_BASIC_SETTINGS_DIFFICULTY_LEVEL_SELECTED = "teacher_app_test_page_basic_settings_difficulty_level_selected",
  TEACHER_APP_TEST_PAGE_BASIC_SETTINGS_SAVE_AND_NEXT_CLICKED = "teacher_app_test_page_basic_settings_save&next_clicked",
  TEACHER_APP_TEST_PAGE_ADD_QUESTIONS_USE_QUESTION_BANK_SELECTED = "teacher_app_test_page_add_questions_use_question_bank_selected",
  TEACHER_APP_TEST_PAGE_ADD_QUESTIONS_TYPE_YOU_QUESTION_SELECTED = "teacher_app_test_page_add_questions_type_you_question_selected",
  TEACHER_APP_TEST_PAGE_ADD_QUESTIONS_UPLOAD_QUESTION_PAPER_SELECTED = "teacher_app_test_page_add_questions_upload_question_paper_selected",
  TEACHER_APP_TEST_PAGE_EDIT_QUESTIONS_ADD_BUTTON_CLICKED = "teacher_app_test_page_edit_questions_add_button_clicked",
  TEACHER_APP_TEST_PAGE_EDIT_QUESTIONS_REMOVE_BUTTON_CLICKED = "teacher_app_test_page_edit_questions_remove_button_clicked",
  TEACHER_APP_TEST_PAGE_EDIT_QUESTIONS_SUBMIT_BUTTON_CLICKED = "teacher_app_test_page_edit_questions_submit_button_clicked",
  TEACHER_APP_TEST_PAGE_ADD_QUESTIONS_PREVIEW_TEST_CLICKED = "teacher_app_test_page_add_questions_preview_test_clicked",
  TEACHER_APP_TEST_PAGE_ADD_QUESTIONS_SAVE_AND_NEXT_CLICKED = "teacher_app_test_page_add_questions_save&next_clicked",
  TEACHER_APP_TEST_PAGE_VIEW_TEST_CLICKED = "teacher_app_test_page_view_test_clicked",
  TEACHER_APP_TEST_PAGE_REPORT_CLICKED = "teacher_app_test_page_report_clicked",
  TEACHER_APP_TEST_PAGE_SHARE_BUTTON_CLICKED = "teacher_app_test_page_share_button_clicked",
  TEACHER_APP_TEST_PAGE_QUESTION_BANK_CLICKED = "teacher_app_test_page_question_bank_clicked",

  TEACHER_APP_HOME_PAGE_VIEW_ALL_CLICKED = "teacher_app_home_page_view_all_clicked",
  TEACHER_APP_HOME_PAGE_CREATE_TEST_CLICKED = "teacher_app_home_page_create_test_clicked",
  TEACHER_APP_HOME_PAGE_VIEW_TEST_CLICKED = "teacher_app_home_page_view_test_clicked",
  TEACHER_APP_HOME_PAGE_CLASS_FILTER_CLICKED = "teacher_app_home_page_class_filter_clicked",
  TEACHER_APP_HOME_PAGE_SUBJECT_CLICKED = "teacher_app_home_page_subject_clicked",

  TEACHER_APP_TEST_PAGE_SUBJECT_SELECTED = "teacher_app_test_page_subject_selected",
  TEACHER_APP_TEST_PAGE_CLASS_SELECTED = "teacher_app_test_page_class_selected",

  TEACHER_APP_TEST_PAGE_OPTIONS_BUTTON_CLICKED = "teacher_app_test_page_options_button_clicked",
  TEACHER_APP_TEST_PAGE_DOWNLOAD_BUTTON_CLICKED = "teacher_app_test_page_download_button_clicked",
  TEACHER_APP_TEST_PAGE_VIEW_REPORT_CLICKED = "teacher_app_test_page_view_report_clicked",
  TEACHER_APP_TEST_PAGE_VIEW_RESPONSES_CLICKED = "teacher_app_test_page_view_responses_clicked",
  TEACHER_APP_TEST_PAGE_TEST_CARD_CLICKED = "teacher_app_test_page_test_card_clicked",

  TEACHER_APP_TEST_PAGE_REPORT_SECTION_VIEW_REMEDIATION_CLICKED = "teacher_app_test_page_report_section_view_remediation_clicked",
  TEACHER_APP_TEST_PAGE_REPORT_SECTION_STUDENT_SELECTED = "teacher_app_test_page_report_section_student_selected",
  TEACHER_APP_TEST_PAGE_RESPONSE_SECTION_STUDENT_SELECTED = "teacher_app_test_page_response_section_student_selected",
  TEACHER_APP_TEST_PAGE_RESPONSE_SECTION_UPDATE_MARKS_CLICKED = "teacher_app_test_page_response_section_update_marks_clicked",
  TEACHER_APP_TEST_PAGE_RESPONSE_SECTION_SUBMIT_BUTTON_CLICKED = "teacher_app_test_page_response_section_submit_button_clicked",
  VIGNAM_APP_PREMIUM_FEATURE_ACCESSED = "vignam_app_premium_feature_accessed",

  //new Test events
  CREATE_TEST_CLICKED = "create_test_clicked",
  CREATE_TEST_NEXT_BUTTON_CLICKED = "create_test_next_button_clicked",
  CREATE_TEST_BACK_BUTTON_CLICKED = "create_test_back_button_clicked",
  CREATE_TEST_GENERATE_WITH_AI_SELECTED = "create_test_generate_with_ai_selected",
  CREATE_TEST_TYPE_YOUR_QUESTION_SELECTED = "create_test_type_your_question_selected",
  CREATE_TEST_UPLOAD_WORD_FILE_SELECTED = "create_test_upload_word_file_selected",
  CREATE_TEST_DOWNLOAD_SAMPLE_WORD_FILE = "create_test_download_sample_word_file",
  CREATE_TEST_ADD_QUESTION_CLICKED = "create_test_add_question_clicked",
  CREATE_TEST_ADD_IMAGE_CLICKED = "create_test_add_image_clicked",
  CREATE_TEST_ADD_FROM_QUESTION_BANK_CLICKED = "create_test_add_from_question_bank_clicked",
  CREATE_TEST_CREATE_NEW_QUESTION_CLICKED = "create_test_create_new_question_clicked",
  CREATE_TEST_SAVE_AND_CREATE_TEST_CLICKED = "create_test_save_and_create_test_clicked",
  CREATE_TEST_DELETE_CLICKED = "create_test_delete_clicked",
  CREATE_TEST_EDIT_CLICKED = "create_test_edit_clicked",

  //courses events
  COURSE_EDIT_BUTTON_CLICKED = "course_edit_button_clicked",
  COURSE_DELETE_BUTTON_CLICKED = "course_delete_button_clicked",
  COURSE_VIEW_CLICKED = "course_view_clicked",
  ADD_NEW_COURSE_BUTTON_CLICKED = "add_new_course_button_clicked",
  COURSE_NEXT_BUTTON_CLICKED = "course_next_button_clicked",
  COURSE_VIDEO_ADDED = "course_video_added",
  COURSE_TEST_ADDED = "course_test_added",
  COURSE_NOTES_ADDED = "course_notes_added",
  COURSE_SAVE_AND_CREATE_CLICKED = "course_save_and_create_clicked",

  //test series events
  TEST_SERIES_EDIT_BUTTON_CLICKED = "test_series_edit_button_clicked",
  TEST_SERIES_DELETE_BUTTON_CLICKED = "test_series_delete_button_clicked",
  TEST_SERIES_VIEW_CLICKED = "test_series_view_clicked",
  ADD_NEW_TEST_SERIES_BUTTON_CLICKED = "add_new_test_series_button_clicked",
  TEST_SERIES_NEXT_BUTTON_CLICKED = "test_series_next_button_clicked",
  TEST_SERIES_TEST_ADDED = "test_series_test_added",
  TEST_SERIES_SAVE_AND_CREATE_CLICKED = "test_series_save_and_create_clicked",

  //dashboard

  DASHBOARD_WEBSITE_BUILDER_ACCESSED = "dashboard_website_builder_accessed",
  DASHBOARD_WEBSITE_SHARE_BUTTON_CLICKED = "dashboard_website_share_button_clicked",
  DASHBOARD_FEATURE_ACCESSED = "dashboard_feature_accessed",
  WEBSITE_BUILDER_HERO_SUBMIT_BUTTON_CLICKED = "website_builder_hero_submit_button_clicked",
  WEBSITE_BUILDER_ABOUT_US_SUBMIT_BUTTON_CLICKED = "website_builder_about_us_submit_button_clicked",
  WEBSITE_BUILDER_FACILITIES_SUBMIT_BUTTON_CLICKED = "website_builder_facilities_submit_button_clicked",
  WEBSITE_BUILDER_TESTINOMIALS_SUBMIT_BUTTON_CLICKED = "website_builder_testinomials_submit_button_clicked",
  WEBSITE_BUILDER_TEAM_MEMBER_SUBMIT_BUTTON_CLICKED = "website_builder_team_member_submit_button_clicked",
  WEBSITE_BUILDER_FOOTER_SUBMIT_BUTTON_CLICKED = "website_builder_footer_submit_button_clicked",
  WEBSITE_BUILDER_APPLY_NEW_THEME_SUBMIT_BUTTON_CLICKED = "website_builder_apply_new_theme_submit_button_clicked",
  WEBSITE_BUILDER_IMAGE_ADDED = "website_builder_image_added",

  //website parent-side

  INSTITUTE_WEBSITE_CONTACT_US_CLICKED = "institute_website_contact_us_clicked",
  INSTITUTE_WEBSITE_HEADER_ITEM_CLICKED = "institute_website_header_item_clicked",
  INSTITUTE_WEBSITE_FOOTER_ITEM_CLICKED = "institute_website_footer_item_clicked",

  //courses-parent side

  INSTITUTE_WEBSITE_COURSES_BUY_NOW_CLICKED = "institute_website_courses_buy_now_clicked",
  INSTITUTE_WEBSITE_COURSES_REGISTERED = "institute_website_courses_registered",
  INSTITUTE_WEBSITE_COURSES_BOUGHT = "institute_website_courses_bought",

  //course-parent side

  PARENT_APP_COURSE_ACCESSED = "parent_app_course_accessed",

  //fee management
  COURSE_FEE_ADDED = "course_fee_added",
  FEE_DETAILS_UPDATED = "fee_details_updated",
  INSTALLMENT_RECEIPT_DOWNLOADED = "installment_receipt_downloaded",

  //simulation
  SIMULATION_TIME_SPEND = "simualtion_time_spend",
}
