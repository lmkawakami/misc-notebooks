from prometheus_client import REGISTRY
from typing import List, Dict
from metrics.batch_running_status_enum import BatchRunningStatus
from metrics.metrics import(
    task_processing_status_enum_name,
    files_running_status_enum_name,
    task_steps_processing_histogram_name,
    file_step_processing_histogram_name,
    task_enum_status,
    file_enum_states
)

def _get_enum_status(enum_name: str, labels: Dict[str, str], possible_status: List[str]):
        for state in possible_status:
            labels_with_status = labels.copy()
            labels_with_status[enum_name] = state
            if REGISTRY.get_sample_value(enum_name, labels=labels_with_status) == 1:
                return state

def _get_metric_count(metric_name: str, labels: Dict[str, str]):
    return REGISTRY.get_sample_value(f"{metric_name}_count", labels=labels) or 0

def get_task_processing_status_enum_status(common_labels: Dict[str, str]):
    return _get_enum_status(
        enum_name=task_processing_status_enum_name,
        labels=common_labels,
        possible_status=task_enum_status
    )

def get_task_steps_processing_histogram_count(common_labels: Dict[str, str], status: BatchRunningStatus):
    labels = dict(**common_labels, status=status.value)
    return _get_metric_count(
        metric_name=task_steps_processing_histogram_name,
        labels=labels
    )

def get_file_processing_status_enum_status(file_enum_labels: Dict[str, str]):
    return _get_enum_status(
        enum_name=files_running_status_enum_name,
        labels=file_enum_labels,
        possible_status=file_enum_states
    )

def get_file_steps_processing_histogram_count(file_labels: Dict[str, str], status: BatchRunningStatus):
    labels = dict(**file_labels, status=status.value)
    return _get_metric_count(
        metric_name=file_step_processing_histogram_name,
        labels=labels
    )