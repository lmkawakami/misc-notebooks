from metrics.batch_metrics import BatchMetrics, BatchRunningStatus, BatchFileTracker
from metrics.testing_registry import PrometheusRegistry
from prometheus_client import start_http_server

start_http_server(8001)

common_labels = {
    "trace_id": "abc123",
    "source_app": "test_app",
    "vendor": "test_vendor",
    "service": "test_service"
}

def get_file_histogram_counts(file_tracker: BatchFileTracker, status: BatchRunningStatus):
    return PrometheusRegistry.get_file_step_processing_histogram_count(file_tracker._enum_labels, status.value)

def get_file_status(file_tracker: BatchFileTracker):
    return PrometheusRegistry.get_file_running_status(file_tracker._enum_labels)

zip_file_name = "file.zip"

BatchMetrics.init(**common_labels)
BatchMetrics.track_new_file(zip_file_name)

zip_file_tracker = BatchMetrics._tracked_files[zip_file_name]

assert get_file_status(zip_file_tracker) == BatchRunningStatus.IDLE.value

transfer_counts_before = get_file_histogram_counts(zip_file_tracker, BatchRunningStatus.TRANSFERRING)
with BatchMetrics.track_file_status(zip_file_name)(BatchRunningStatus.TRANSFERRING):
    assert get_file_status(zip_file_tracker) == BatchRunningStatus.TRANSFERRING.value
transfer_counts_after = get_file_histogram_counts(zip_file_tracker, BatchRunningStatus.TRANSFERRING)
assert get_file_status(zip_file_tracker) == BatchRunningStatus.IDLE.value
assert transfer_counts_after - transfer_counts_before == 1

unzip_counts_before = get_file_histogram_counts(zip_file_tracker, BatchRunningStatus.UNZIPPING)
with BatchMetrics.track_file_status(zip_file_name)(BatchRunningStatus.UNZIPPING):
    a_xlsx_file_name = "a.xlsx"
    b_xlsx_file_name = "b.xlsx"
    BatchMetrics.track_new_spawned_files([a_xlsx_file_name, b_xlsx_file_name], zip_file_name)
    a_xlsx_file_tracker = BatchMetrics._tracked_files[a_xlsx_file_name]
    b_xlsx_file_tracker = BatchMetrics._tracked_files[b_xlsx_file_name]
    # assert get_file_status(a_xlsx_file_tracker) == BatchRunningStatus.UNZIPPING.value
    # assert get_file_status(b_xlsx_file_tracker) == BatchRunningStatus.UNZIPPING.value
    assert get_file_status(zip_file_tracker) == BatchRunningStatus.UNZIPPING.value
unzip_counts_after = get_file_histogram_counts(zip_file_tracker, BatchRunningStatus.UNZIPPING)
assert get_file_status(a_xlsx_file_tracker) == BatchRunningStatus.IDLE.value
assert get_file_status(b_xlsx_file_tracker) == BatchRunningStatus.IDLE.value
assert get_file_status(zip_file_tracker) == BatchRunningStatus.IDLE.value
assert unzip_counts_after - unzip_counts_before == 1

convert_counts_before = get_file_histogram_counts(a_xlsx_file_tracker, BatchRunningStatus.CONVERTING)
with BatchMetrics.track_file_status(a_xlsx_file_name)(BatchRunningStatus.CONVERTING):
    a_csv_file_name = "a.csv"
    BatchMetrics.track_new_spawned_files([a_csv_file_name], a_xlsx_file_name)
    a_csv_file_tracker = BatchMetrics._tracked_files[a_csv_file_name]
    # assert get_file_status(a_csv_file_tracker) == BatchRunningStatus.CONVERTING.value
    assert get_file_status(a_xlsx_file_tracker) == BatchRunningStatus.CONVERTING.value
convert_counts_after = get_file_histogram_counts(a_xlsx_file_tracker, BatchRunningStatus.CONVERTING)
assert get_file_status(a_csv_file_tracker) == BatchRunningStatus.IDLE.value
assert get_file_status(a_xlsx_file_tracker) == BatchRunningStatus.IDLE.value
assert convert_counts_after - convert_counts_before == 1

convert_counts_before = get_file_histogram_counts(b_xlsx_file_tracker, BatchRunningStatus.CONVERTING)
with BatchMetrics.track_file_status(b_xlsx_file_name)(BatchRunningStatus.CONVERTING):
    b_csv_file_name = "b.csv"
    BatchMetrics.track_new_spawned_files([b_csv_file_name], b_xlsx_file_name)
    b_csv_file_tracker = BatchMetrics._tracked_files[b_csv_file_name]
    # assert get_file_status(b_csv_file_tracker) == BatchRunningStatus.CONVERTING.value
    assert get_file_status(b_xlsx_file_tracker) == BatchRunningStatus.CONVERTING.value
convert_counts_after = get_file_histogram_counts(b_xlsx_file_tracker, BatchRunningStatus.CONVERTING)
assert get_file_status(b_csv_file_tracker) == BatchRunningStatus.IDLE.value
assert get_file_status(b_xlsx_file_tracker) == BatchRunningStatus.IDLE.value
assert convert_counts_after - convert_counts_before == 1

transfer_counts_before = get_file_histogram_counts(a_csv_file_tracker, BatchRunningStatus.TRANSFERRING)
with BatchMetrics.track_file_status(a_csv_file_name)(BatchRunningStatus.TRANSFERRING):
    assert get_file_status(a_csv_file_tracker) == BatchRunningStatus.TRANSFERRING.value
transfer_counts_after = get_file_histogram_counts(a_csv_file_tracker, BatchRunningStatus.TRANSFERRING)
assert get_file_status(a_csv_file_tracker) == BatchRunningStatus.IDLE.value
assert transfer_counts_after - transfer_counts_before == 1

transfer_counts_before = get_file_histogram_counts(b_csv_file_tracker, BatchRunningStatus.TRANSFERRING)
with BatchMetrics.track_file_status(b_csv_file_name)(BatchRunningStatus.TRANSFERRING):
    assert get_file_status(b_csv_file_tracker) == BatchRunningStatus.TRANSFERRING.value
transfer_counts_after = get_file_histogram_counts(b_csv_file_tracker, BatchRunningStatus.TRANSFERRING)
assert get_file_status(b_csv_file_tracker) == BatchRunningStatus.IDLE.value
assert transfer_counts_after - transfer_counts_before == 1
