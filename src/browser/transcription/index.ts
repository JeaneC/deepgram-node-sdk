import {
  LiveTranscriptionOptions,
  PrerecordedTranscriptionOptions,
  PrerecordedTranscriptionResponse,
  UrlSource,
} from "../../types";
import querystring from "querystring";
import { preRecordedTranscription } from "./preRecordedTranscription";

export class Transcriber {
  constructor(private _credentials: string, private _apiUrl: string, private _requireSSL: boolean) { }

  /**
   * Transcribes prerecorded audio from a file or buffer
   * @param source Url or Buffer of file to transcribe
   * @param options Options to modify transcriptions
   */
  async preRecorded(
    source: UrlSource,
    options?: PrerecordedTranscriptionOptions
  ): Promise<PrerecordedTranscriptionResponse> {
    return await preRecordedTranscription(
      this._credentials,
      this._apiUrl || "",
      this._requireSSL || true,
      source,
      options
    );
  }

  /**
   * Opens a websocket to Deepgram's API for live transcriptions
   * @param options Options to modify transcriptions
   */
  live(options?: LiveTranscriptionOptions): WebSocket {
    const protocol = this._requireSSL ? "wss" : "ws";

    return new WebSocket(
      `${protocol}://${this._apiUrl}/v1/listen?${querystring.stringify(options)}`,
      ["token", this._credentials]
    );
  }
}
