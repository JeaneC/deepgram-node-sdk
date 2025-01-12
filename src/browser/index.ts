import { DefaultOptions } from "../constants";
import { validateOptions } from "../helpers";
import { Transcriber } from "./transcription";
import { Projects } from "../projects";
import { Keys } from "../keys";
import { Usage } from "../usage";
import { Members } from "../members";
import { Invitation } from "../invitation";
import { Billing } from "../billing";
import { Scopes } from "../scopes";

import { _request } from "./httpFetch";

export class Deepgram {
  private _apiUrl: string;
  private _apiKey: string;
  private _requireSSL: boolean;

  transcription: Transcriber;
  projects: Projects;
  keys: Keys;
  usage: Usage;
  members: Members;
  invitation: Invitation;
  billing: Billing;
  scopes: Scopes;

  constructor(apiKey: string, apiUrl?: string, requireSSL?: boolean) {
    this._apiKey = apiKey;
    this._apiUrl = apiUrl || DefaultOptions.apiUrl;
    this._requireSSL = requireSSL || DefaultOptions.requireSSL;

    /**
     * Ensures that the provided options were provided
     */
    validateOptions(this._apiKey, this._apiUrl);

    this.transcription = new Transcriber(this._apiKey, this._apiUrl, this._requireSSL);
    this.projects = new Projects(this._apiKey, this._apiUrl, this._requireSSL, _request);
    this.keys = new Keys(this._apiKey, this._apiUrl, this._requireSSL, _request);
    this.usage = new Usage(this._apiKey, this._apiUrl, this._requireSSL, _request);
    this.members = new Members(this._apiKey, this._apiUrl, this._requireSSL, _request);
    this.invitation = new Invitation(this._apiKey, this._apiUrl, this._requireSSL, _request);
    this.billing = new Billing(this._apiKey, this._apiUrl, this._requireSSL, _request);
    this.scopes = new Scopes(this._apiKey, this._apiUrl, this._requireSSL, _request);
  }
}
