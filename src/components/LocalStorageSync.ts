import * as React from 'react';

type LocalStorageLoadHandler<T> = (data: T) => void;
type LocalStorageQuotaExceededHandler = () => void;

interface Props<T> {
  localStorageKey: string;
  data: T;
  onLoad: LocalStorageLoadHandler<T>;
  onStorageFull: LocalStorageQuotaExceededHandler;
  exclude: string[];
}

interface State {
  loaded?: boolean;
  hasReportedFailure?: boolean;
}

export default class LocalStorageSync<T> extends React.Component<Props<T>, State> {
  state: State = {};

  static defaultProps = {
    exclude: [],
  };

  load() {
    const data = localStorage.getItem(this.props.localStorageKey);
    if (data) {
      let loadedData;
      try {
        loadedData = JSON.parse(data);
      } catch (e) {}
      if (loadedData) {
        for (const key of this.props.exclude) delete (loadedData as any)[key];
        this.props.onLoad(loadedData);
      }
    }
    this.setState({ loaded: true });
  }

  save = () => {
    if (!this.state.loaded) return;
    try {
      const copy = { ...this.props.data as any };
      for (const key of this.props.exclude) delete (copy as any)[key];
      localStorage.setItem(this.props.localStorageKey, JSON.stringify(this.props.data));
      this.setState({ hasReportedFailure: false });
    } catch (exc) {
      if (exc instanceof DOMException && exc.code === DOMException.QUOTA_EXCEEDED_ERR) {
        if (!this.state.hasReportedFailure) {
          this.props.onStorageFull();
          this.setState({ hasReportedFailure: true });
        }
      } else {
        throw exc;
      }
    }
  }

  componentWillMount() {
    this.load();
  }

  componentWillUnmount() {
    this.save();
  }

  componentDidUpdate({ data }: Props<T>) {
    if (data !== this.props.data) {
      this.save();
    }
  }

  render() {
    return null;
  }
}
