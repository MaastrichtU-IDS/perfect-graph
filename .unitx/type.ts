import {
  File, Email, Date, DateTime, Uri,
} from 'unitx/type'

export type _config = {
  output: '/Users/turgaysaba/Desktop/projects/perfect-graph-reference/utils/schema';
}

type BooleanDataItem = {
  type: 'boolean';
  key: string;
  value: boolean;
}

type EmailDataItem = {
  type: 'email';
  key: string;
  value: Email;
}
type DateTimeDataItem = {
  type: 'dateTime';
  key: string;
  value: DateTime;
}
type UriDataItem = {
  type: 'uri';
  key: string;
  value: Uri;
}

type StringDataItem = {
  type: 'string';
  key: string;
  value: string;
}
type DateDataItem = {
  type: 'date';
  key: string;
  value: Date;
}
type FileDataItem = {
  type: 'file';
  key: string;
  value: File;
}

export type DataItem = DateDataItem
| StringDataItem
| BooleanDataItem
| FileDataItem
| UriDataItem
| DateTimeDataItem
| EmailDataItem
