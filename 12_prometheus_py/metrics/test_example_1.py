from metrics.batch_metrics import BatchMetrics, BatchRunningStatus
from prometheus_client import start_http_server

start_http_server(8001)

common_labels = {
    "trace_id": "abc123",
    "source_app": "test_app",
    "vendor": "test_vendor",
    "service": "test_service"
}


BatchMetrics.init(**common_labels)
assert BatchMetrics.get_task_enum_status() == BatchRunningStatus.IDLE.value


downloads_count_before = BatchMetrics.get_task_histogram_count(BatchRunningStatus.DOWNLOADING)
with BatchMetrics.track_task_status(BatchRunningStatus.DOWNLOADING):
    assert BatchMetrics.get_task_enum_status() == BatchRunningStatus.DOWNLOADING.value
downloads_count_after = BatchMetrics.get_task_histogram_count(BatchRunningStatus.DOWNLOADING)
assert BatchMetrics.get_task_enum_status() == BatchRunningStatus.IDLE.value
assert downloads_count_after - downloads_count_before == 1


transfer_counts_before = BatchMetrics.get_task_histogram_count(BatchRunningStatus.TRANSFERRING)
with BatchMetrics.track_task_status(BatchRunningStatus.TRANSFERRING):
    assert BatchMetrics.get_task_enum_status() == BatchRunningStatus.TRANSFERRING.value
transfer_counts_after = BatchMetrics.get_task_histogram_count(BatchRunningStatus.TRANSFERRING)
assert BatchMetrics.get_task_enum_status() == BatchRunningStatus.IDLE.value
assert transfer_counts_after - transfer_counts_before == 1

converts_counts_before = BatchMetrics.get_task_histogram_count(BatchRunningStatus.CONVERTING)
with BatchMetrics.track_task_status(BatchRunningStatus.CONVERTING):
    assert BatchMetrics.get_task_enum_status() == BatchRunningStatus.CONVERTING.value
converts_counts_after = BatchMetrics.get_task_histogram_count(BatchRunningStatus.CONVERTING)
assert BatchMetrics.get_task_enum_status() == BatchRunningStatus.IDLE.value
assert converts_counts_after - converts_counts_before == 1

transfer_counts_before = BatchMetrics.get_task_histogram_count(BatchRunningStatus.TRANSFERRING)
try:
    with BatchMetrics.track_task_status(BatchRunningStatus.TRANSFERRING):
        assert BatchMetrics.get_task_enum_status() == BatchRunningStatus.TRANSFERRING.value
        raise Exception()
except:
    pass
transfer_counts_after = BatchMetrics.get_task_histogram_count(BatchRunningStatus.TRANSFERRING)
assert BatchMetrics.get_task_enum_status() == BatchRunningStatus.FAILED.value
assert transfer_counts_after - transfer_counts_before == 1
