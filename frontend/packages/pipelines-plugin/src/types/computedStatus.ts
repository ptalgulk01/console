export enum ComputedStatus {
  Cancelling = 'Cancelling',
  Succeeded = 'Succeeded',
  Failed = 'Failed',
  Running = 'Running',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  'In Progress' = 'In Progress',
  FailedToStart = 'FailedToStart',
  PipelineNotStarted = 'PipelineNotStarted',
  Skipped = 'Skipped',
  Cancelled = 'Cancelled',
  Pending = 'Pending',
  Idle = 'Idle',
  Other = '-',
}

export enum ApprovalStatus {
  Idle = 'idle',
  RequestSent = 'wait',
  Accepted = 'true',
  Rejected = 'false',
  TimedOut = 'timeout',
}

export enum CustomRunStatus {
  RunCancelled = 'RunCancelled',
}
