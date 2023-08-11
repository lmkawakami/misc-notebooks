from prometheus_client import Enum, Histogram
from metrics.labels_models import CommonLabels, FileSpecificLabels
from metrics.batch_running_status_enum import BatchRunningStatus
# from prometheus_client import REGISTRY
# from typing import List, Dict

task_enum_labels = list(CommonLabels.__fields__.keys())
task_enum_status = [status.value for status in BatchRunningStatus]
task_histogram_labels = task_enum_labels + ["status"]

task_processing_status_enum_name = "batch_task_running_status"
task_processing_status_enum = Enum(
    task_processing_status_enum_name,
    "enum with the current running status of the batch process task",
    task_enum_labels,
    states=task_enum_status,
)

# def _get_enum_status(enum_name: str, labels: Dict[str, str], possible_status: List[str]):
#         for state in possible_status:
#             labels_with_status = labels.copy()
#             labels_with_status[enum_name] = state
#             if REGISTRY.get_sample_value(enum_name, labels=labels_with_status) == 1:
#                 return state

# def get_task_processing_status_enum_status(common_labels: Dict[str, str]):
#     return _get_enum_status(
#         enum_name=task_processing_status_enum_name,
#         labels=common_labels,
#         possible_status=task_enum_status
#     )


task_steps_processing_histogram_name = "batch_step_processing_histogram"
task_steps_processing_histogram = Histogram(
    "batch_step_processing_histogram",
    "histogram with times of each processing step",
    task_histogram_labels,
)

# def _get_metric_count(metric_name: str, labels: Dict[str, str]):
#     print("new", metric_name, labels)
#     return REGISTRY.get_sample_value(f"{metric_name}_count", labels=labels) or 0


# def get_task_steps_processing_histogram_count(common_labels: Dict[str, str], status: BatchRunningStatus):
#     labels = dict(**common_labels, status=status.value)
#     return _get_metric_count(
#         metric_name=task_steps_processing_histogram_name,
#         labels=labels
#     )


file_enum_labels = list(CommonLabels.__fields__.keys()) + list(FileSpecificLabels.__fields__.keys())
file_enum_states = [status.value for status in BatchRunningStatus]
file_histogram_labels = file_enum_labels + ["status"]

files_running_status_enum_name = 'batch_file_running_status'
files_running_status_enum = Enum(
    'batch_file_running_status',
    'enum with the current running status of each file',
    file_enum_labels,
    states=file_enum_states,
)
# def get_file_processing_status_enum_status(file_enum_labels: Dict[str, str]):
#     return _get_enum_status(
#         enum_name=files_running_status_enum_name,
#         labels=file_enum_labels,
#         possible_status=file_enum_states
#     )

file_step_processing_histogram_name = "file_step_processing_histogram"
file_step_processing_histogram = Histogram(
    "file_step_processing_histogram",
    "histogram with processing times of the each file divided by step",
    file_histogram_labels,
)
# def get_file_steps_processing_histogram_count(file_labels: Dict[str, str], status: BatchRunningStatus):
#     labels = dict(**file_labels, status=status.value)
#     return _get_metric_count(
#         metric_name=file_step_processing_histogram_name,
#         labels=labels
#     )
