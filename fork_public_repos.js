const github = require('@actions/github')

const ghToken = process.env.GITHUB_AUTH_TOKEN
const src_org = process.env.SRC_GITHUB_ORG
const dst_org = process.env.DST_GITHUB_ORG
const octokit = github.getOctokit(ghToken)


const main = async () => {


  try {
 
    const repos = await octokit.paginate('GET /orgs/{org}/repos{?q,per_page,page}', {
      org: src_org,
      per_page: 100
    })

    for ( const repo of repos ){
      console.log(repo.name);
  
      await octokit.request('POST /repos/{owner}/{repo}/forks', {
        owner: src_org,
        repo: repo.name,
        organization: dst_org,
        default_branch_only: true,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
      });
    }
    return [];
  } catch (err) {
    console.log(`error: ${JSON.stringify(err,null,2)}`);
  }
}

main()
