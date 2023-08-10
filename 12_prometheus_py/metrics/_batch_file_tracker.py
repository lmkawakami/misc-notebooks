from metrics.labels_models import CommonLabels, FileSpecificLabels
from metrics.batch_running_status_enum import BatchRunningStatus
from metrics.metrics import (
    files_running_status_enum,
    file_step_processing_histogram,
)
from contextlib import contextmanager
import time


def get_epoch() -> int:
    return int(time.time() * 1000)


class BatchFileTracker:
    _files_running_status_enum = files_running_status_enum
    _file_step_processing_histogram = file_step_processing_histogram
    _common_labels: CommonLabels
    _file_labels: FileSpecificLabels

    @classmethod
    def set_common_labels(cls, trace_id, source_app, vendor, service) -> None:
        cls._common_labels = CommonLabels(
            trace_id=trace_id,
            source_app=source_app,
            vendor=vendor,
            service=service,
        )

    def __init__(self, file_name: str, origin_file_name: str) -> None:
        self._file_labels = FileSpecificLabels(
            file_name=file_name,
            origin_file_name=origin_file_name
        )
        self._register_file_status(BatchRunningStatus.IDLE)

    def _register_file_status(self, status: BatchRunningStatus):
        self._files_running_status_enum.labels(**self._enum_labels).state(status.value)

    @property
    def _enum_labels(self):
        return dict(
            **self._common_labels.dict(),
            **self._file_labels.dict()
        )

    def _observe_file_step_processing_duration(self, status: BatchRunningStatus, duration_ms: int):
        duration_s = duration_ms / 1000
        histogram_labels = self._histogram_labels(status)
        self._file_step_processing_histogram.labels(**histogram_labels).observe(duration_s)

    def _histogram_labels(self, status: BatchRunningStatus):
        return dict(
            **self._common_labels.dict(),
            **self._file_labels.dict(),
            status = status.value
        )

    @contextmanager
    def track_file_status(self, status: BatchRunningStatus):
        self._register_file_status(status)
        start_epoch = get_epoch()
        try:
            yield
        except Exception as err:
            next_status = BatchRunningStatus.FAILED
            raise err
        else:
            next_status = BatchRunningStatus.IDLE
        finally:
            end_epoch = get_epoch()
            self._register_file_status(next_status)
            duration = end_epoch - start_epoch
            self._observe_file_step_processing_duration(status, duration)
