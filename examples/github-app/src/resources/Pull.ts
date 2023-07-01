import { GithubEntity, createGithubResource } from './Base';
import { Label } from './Label';
import { stateToIcon } from './stateToIcon';
import { User } from './User';

export class Pull extends GithubEntity {
  url = '';
  htmlUrl = '';
  diffUrl = '';
  patchUrl = '';
  issueUrl = '';
  number = 0;
  state: 'open' | 'closed' | 'all' = 'open';
  locked = false;
  title = '';
  user = User.fromJS({});
  body = '';
  labels: Label[] = [];
  activeLockReason = '';
  createdAt = new Date(0);
  updatedAt = new Date(0);
  closedAt: Date | null = null;
  authorAssociation = 'OWNER';
  autoMerge: null | boolean = null;
  draft = false;

  get stateIcon() {
    return stateToIcon[this.state];
  }

  get owner() {
    const pieces = this.htmlUrl.split('/');
    return pieces[pieces.length - 4];
  }

  get repo() {
    const pieces = this.htmlUrl.split('/');
    return pieces[pieces.length - 3];
  }

  static schema = {
    user: User,
    createdAt: Date,
    updatedAt: Date,
    closedAt: Date,
    labels: [Label],
  };

  static key = 'Pull';
}

export const PullResource = createGithubResource({
  path: '/repos/:owner/:repo/pulls/:number',
  schema: Pull,
  pollFrequency: 60000,
  searchParams: {} as PullFilters | undefined,
});
export default PullResource;

export interface PullFilters {
  state?: 'open' | 'closed' | 'all';
  page?: number | string;
}
