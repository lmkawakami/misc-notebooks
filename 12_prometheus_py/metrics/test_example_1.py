from metrics.batch_metrics import BatchMetrics, BatchRunningStatus
from metrics.testing_registry import PrometheusRegistry
from prometheus_client import start_http_server

start_http_server(8001)

common_labels = {
    "trace_id": "abc123",
    "source_app": "test_app",
    "vendor": "test_vendor",
    "service": "test_service"
}

def get_task_histogram_counts(status: BatchRunningStatus):
    return PrometheusRegistry.get_task_step_processing_histogram_count(common_labels, status.value)

def get_task_status():
    return PrometheusRegistry.get_task_running_status(common_labels)

BatchMetrics.init(**common_labels)
assert get_task_status() == BatchRunningStatus.IDLE.value

downloads_count_before = get_task_histogram_counts(BatchRunningStatus.DOWNLOADING)
with BatchMetrics.track_task_status(BatchRunningStatus.DOWNLOADING):
    assert get_task_status() == BatchRunningStatus.DOWNLOADING.value
downloads_count_after = get_task_histogram_counts(BatchRunningStatus.DOWNLOADING)
assert get_task_status() == BatchRunningStatus.IDLE.value
assert downloads_count_after - downloads_count_before == 1

transfer_counts_before = get_task_histogram_counts(BatchRunningStatus.TRANSFERRING)
with BatchMetrics.track_task_status(BatchRunningStatus.TRANSFERRING):
    assert get_task_status() == BatchRunningStatus.TRANSFERRING.value
transfer_counts_after = get_task_histogram_counts(BatchRunningStatus.TRANSFERRING)
assert get_task_status() == BatchRunningStatus.IDLE.value
assert transfer_counts_after - transfer_counts_before == 1

converts_counts_before = get_task_histogram_counts(BatchRunningStatus.CONVERTING)
with BatchMetrics.track_task_status(BatchRunningStatus.CONVERTING):
    assert get_task_status() == BatchRunningStatus.CONVERTING.value
converts_counts_after = get_task_histogram_counts(BatchRunningStatus.CONVERTING)
assert get_task_status() == BatchRunningStatus.IDLE.value
assert converts_counts_after - converts_counts_before == 1

transfer_counts_before = get_task_histogram_counts(BatchRunningStatus.TRANSFERRING)
try:
    with BatchMetrics.track_task_status(BatchRunningStatus.TRANSFERRING):
        assert get_task_status() == BatchRunningStatus.TRANSFERRING.value
        raise Exception()
except:
    pass
transfer_counts_after = get_task_histogram_counts(BatchRunningStatus.TRANSFERRING)
assert get_task_status() == BatchRunningStatus.FAILED.value
assert transfer_counts_after - transfer_counts_before == 1
