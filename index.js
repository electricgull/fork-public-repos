const core = require('@actions/core')
const github = require('@actions/github')

const ghToken = process.env.GITHUB_AUTH_TOKEN
const octokit = github.getOctokit(ghToken)
const org = process.env.GITHUB_ORG


const main = async () => {
 
  try {
    const repos = await octokit.paginate('GET /orgs/{org}/repos{?q,per_page,page}', {
      org,
      per_page: 100
    })

    for ( const repo of repos ){
      console.log(repo.name);
    }
    return [];
  } catch (err) {
    console.log(`error: ${err}`);
  }
}

main()
