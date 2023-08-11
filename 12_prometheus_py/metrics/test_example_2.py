from metrics.batch_metrics import BatchMetrics, BatchRunningStatus
from prometheus_client import start_http_server

start_http_server(8001)

common_labels = {
    "trace_id": "abc123",
    "source_app": "test_app",
    "vendor": "test_vendor",
    "service": "test_service"
}

zip_file_name = "file.zip"

BatchMetrics.init(**common_labels)
BatchMetrics.track_new_file(zip_file_name)

zip_file_tracker = BatchMetrics._tracked_files[zip_file_name]

assert BatchMetrics.get_file_enum_status(zip_file_name) == BatchRunningStatus.IDLE.value

transfer_counts_before = BatchMetrics.get_file_histogram_count(zip_file_name, BatchRunningStatus.TRANSFERRING)
with BatchMetrics.track_file_status(zip_file_name)(BatchRunningStatus.TRANSFERRING):
    assert BatchMetrics.get_file_enum_status(zip_file_name) == BatchRunningStatus.TRANSFERRING.value
transfer_counts_after = BatchMetrics.get_file_histogram_count(zip_file_name, BatchRunningStatus.TRANSFERRING)
assert BatchMetrics.get_file_enum_status(zip_file_name) == BatchRunningStatus.IDLE.value
assert transfer_counts_after - transfer_counts_before == 1

unzip_counts_before = BatchMetrics.get_file_histogram_count(zip_file_name, BatchRunningStatus.UNZIPPING)
with BatchMetrics.track_file_status(zip_file_name)(BatchRunningStatus.UNZIPPING):
    a_xlsx_file_name = "a.xlsx"
    b_xlsx_file_name = "b.xlsx"
    BatchMetrics.track_new_spawned_files([a_xlsx_file_name, b_xlsx_file_name], zip_file_name)
    a_xlsx_file_tracker = BatchMetrics._tracked_files[a_xlsx_file_name]
    b_xlsx_file_tracker = BatchMetrics._tracked_files[b_xlsx_file_name]
    # assert BatchMetrics.get_file_enum_status(a_xlsx_file_name) == BatchRunningStatus.UNZIPPING.value
    # assert BatchMetrics.get_file_enum_status(b_xlsx_file_name) == BatchRunningStatus.UNZIPPING.value
    assert BatchMetrics.get_file_enum_status(zip_file_name) == BatchRunningStatus.UNZIPPING.value
unzip_counts_after = BatchMetrics.get_file_histogram_count(zip_file_name, BatchRunningStatus.UNZIPPING)
assert BatchMetrics.get_file_enum_status(a_xlsx_file_name) == BatchRunningStatus.IDLE.value
assert BatchMetrics.get_file_enum_status(b_xlsx_file_name) == BatchRunningStatus.IDLE.value
assert BatchMetrics.get_file_enum_status(zip_file_name) == BatchRunningStatus.IDLE.value
assert unzip_counts_after - unzip_counts_before == 1

convert_counts_before = BatchMetrics.get_file_histogram_count(a_xlsx_file_name, BatchRunningStatus.CONVERTING)
with BatchMetrics.track_file_status(a_xlsx_file_name)(BatchRunningStatus.CONVERTING):
    a_csv_file_name = "a.csv"
    BatchMetrics.track_new_spawned_files([a_csv_file_name], a_xlsx_file_name)
    a_csv_file_tracker = BatchMetrics._tracked_files[a_csv_file_name]
    # assert BatchMetrics.get_file_enum_status(a_csv_file_name) == BatchRunningStatus.CONVERTING.value
    assert BatchMetrics.get_file_enum_status(a_xlsx_file_name) == BatchRunningStatus.CONVERTING.value
convert_counts_after = BatchMetrics.get_file_histogram_count(a_xlsx_file_name, BatchRunningStatus.CONVERTING)
assert BatchMetrics.get_file_enum_status(a_csv_file_name) == BatchRunningStatus.IDLE.value
assert BatchMetrics.get_file_enum_status(a_xlsx_file_name) == BatchRunningStatus.IDLE.value
assert convert_counts_after - convert_counts_before == 1

convert_counts_before = BatchMetrics.get_file_histogram_count(b_xlsx_file_name, BatchRunningStatus.CONVERTING)
with BatchMetrics.track_file_status(b_xlsx_file_name)(BatchRunningStatus.CONVERTING):
    b_csv_file_name = "b.csv"
    BatchMetrics.track_new_spawned_files([b_csv_file_name], b_xlsx_file_name)
    b_csv_file_tracker = BatchMetrics._tracked_files[b_csv_file_name]
    # assert BatchMetrics.get_file_enum_status(b_csv_file_name) == BatchRunningStatus.CONVERTING.value
    assert BatchMetrics.get_file_enum_status(b_xlsx_file_name) == BatchRunningStatus.CONVERTING.value
convert_counts_after = BatchMetrics.get_file_histogram_count(b_xlsx_file_name, BatchRunningStatus.CONVERTING)
assert BatchMetrics.get_file_enum_status(b_csv_file_name) == BatchRunningStatus.IDLE.value
assert BatchMetrics.get_file_enum_status(b_xlsx_file_name) == BatchRunningStatus.IDLE.value
assert convert_counts_after - convert_counts_before == 1

transfer_counts_before = BatchMetrics.get_file_histogram_count(a_csv_file_name, BatchRunningStatus.TRANSFERRING)
with BatchMetrics.track_file_status(a_csv_file_name)(BatchRunningStatus.TRANSFERRING):
    assert BatchMetrics.get_file_enum_status(a_csv_file_name) == BatchRunningStatus.TRANSFERRING.value
transfer_counts_after = BatchMetrics.get_file_histogram_count(a_csv_file_name, BatchRunningStatus.TRANSFERRING)
assert BatchMetrics.get_file_enum_status(a_csv_file_name) == BatchRunningStatus.IDLE.value
assert transfer_counts_after - transfer_counts_before == 1

transfer_counts_before = BatchMetrics.get_file_histogram_count(b_csv_file_name, BatchRunningStatus.TRANSFERRING)
with BatchMetrics.track_file_status(b_csv_file_name)(BatchRunningStatus.TRANSFERRING):
    assert BatchMetrics.get_file_enum_status(b_csv_file_name) == BatchRunningStatus.TRANSFERRING.value
transfer_counts_after = BatchMetrics.get_file_histogram_count(b_csv_file_name, BatchRunningStatus.TRANSFERRING)
assert BatchMetrics.get_file_enum_status(b_csv_file_name) == BatchRunningStatus.IDLE.value
assert transfer_counts_after - transfer_counts_before == 1
