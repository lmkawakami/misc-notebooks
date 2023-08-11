from typing import List, Dict
from metrics.labels_models import CommonLabels
from metrics.batch_running_status_enum import BatchRunningStatus
from metrics.metrics import (
    task_processing_status_enum,
    task_steps_processing_histogram,
)
from metrics.testing_helpers import (
    get_task_processing_status_enum_status,
    get_task_steps_processing_histogram_count,
    get_file_processing_status_enum_status,
    get_file_steps_processing_histogram_count,
)
from contextlib import contextmanager
from metrics._batch_file_tracker import BatchFileTracker
import time


def get_epoch() -> int:
    return int(time.time() * 1000)


class BatchMetrics:
    _started = False
    _common_labels = CommonLabels()
    _task_processing_status_enum = task_processing_status_enum
    _task_steps_processing_histogram = task_steps_processing_histogram
    _tracked_files: Dict[str, BatchFileTracker] = {}

    @classmethod
    def init(cls, trace_id: str, source_app: str, vendor: str, service: str):
        if cls._started:
            return
        cls._set_common_labels(trace_id, source_app, vendor, service)
        BatchFileTracker.set_common_labels(trace_id, source_app, vendor, service)
        cls._register_task_status(BatchRunningStatus.IDLE)
        cls._started = True

    @classmethod
    @contextmanager
    def track_task_status(cls, status: BatchRunningStatus):
        cls._register_task_status(status)
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
            cls._register_task_status(next_status)
            duration = end_epoch - start_epoch
            cls._observe_step_processing_duration(status, duration)

    @classmethod
    def _set_common_labels(cls, trace_id, source_app, vendor, service) -> None:
        print("setting common labels")
        cls._common_labels = CommonLabels(
            trace_id=trace_id,
            source_app=source_app,
            vendor=vendor,
            service=service,
        )

    @classmethod
    def _register_task_status(cls, status: BatchRunningStatus):
        cls._task_processing_status_enum.labels(**cls._common_labels.dict()).state(status.value)

    @classmethod
    def _observe_step_processing_duration(cls, status: BatchRunningStatus, duration_ms: int):
        duration_s = duration_ms / 1000
        labels = dict(
            **cls._common_labels.dict(),
            status=status.value
        )
        cls._task_steps_processing_histogram.labels(
            **labels
        ).observe(duration_s)

    @classmethod
    def track_new_file(cls, file_name: str, origin_file_name: str = None):
        if origin_file_name is None:
            origin_file_name = file_name
        file_tracker = BatchFileTracker(file_name=file_name, origin_file_name=origin_file_name)
        cls._tracked_files[file_name] = file_tracker

    @classmethod
    def track_new_spawned_files(cls, spawned_files_names: List[str], origin_file_name: str):
        for file_name in spawned_files_names:
            cls.track_new_file(file_name=file_name, origin_file_name=origin_file_name)

    @classmethod
    def track_file_status(cls, file_name: str):
        return cls._tracked_files[file_name].track_file_status

    @classmethod
    def get_task_enum_status(cls):
        return get_task_processing_status_enum_status(cls._common_labels.dict())

    @classmethod
    def get_file_enum_status(cls, file_name: str):
        file_tracker = cls._tracked_files.get(file_name)
        if file_tracker:
            return get_file_processing_status_enum_status(file_tracker._enum_labels)

    @classmethod
    def get_task_histogram_count(cls, status: BatchRunningStatus):
        return get_task_steps_processing_histogram_count(
            cls._common_labels.dict(),
            status
        )

    @classmethod
    def get_file_histogram_count(cls, file_name, status: BatchRunningStatus):
        file_tracker = cls._tracked_files.get(file_name)
        if file_tracker:
            return get_file_steps_processing_histogram_count(
                file_tracker._enum_labels,
                status
            )

# batch
# self._metrics.increment_counter(Metric.EXECUTIONS_COUNTE)
# self._metrics.increment_counter(Metric.EXECUTION_COUNTER_ERROR)
# self._metrics.increment_counter(Metric.BATCH_FILES_COUNTER)
#
# scrap
# self.__metrics.increment_counter(Metric.BATCH_FILES_COUNTER)
# self.__metrics.observe(Metric.PROCESSING_TIME_HISTOGRAM, processing_time / 1000)