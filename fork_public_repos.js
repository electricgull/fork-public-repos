const github = require('@actions/github')

const ghToken = process.env.GITHUB_AUTH_TOKEN
const src_org = process.env.SRC_GITHUB_ORG
const dst_org = process.env.DST_GITHUB_ORG
const octokit = github.getOctokit(ghToken)


const main = async () => {

  try {
    //Get a list of dst_org repos to verify repos already forked
    const dstRepos = await octokit.request('GET /orgs/{org}/repos', {
      org: dst_org,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    })


    const repos = await octokit.paginate('GET /orgs/{org}/repos{?q,per_page,page}', {
      org: src_org,
      per_page: 100
    })

    for ( const repo of repos ){
  
      if( !(dstRepos.data.find(item => { return item.name == repo.name})) ){
        console.log(`Forking ${repo.name}`);
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
      else{
        console.log(`${repo.name} already exists`);
      }

      console.log(`Enabling vulnerability alerts for ${repo.name}`);
      await octokit.request('PUT /repos/{owner}/{repo}/vulnerability-alerts', {
        owner: dst_org,
        repo: repo.name,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
      })

      await sleep(6000);
    }

    return [];
  } catch (err) {
    console.log(`error: ${JSON.stringify(err,null,2)}`);
  }
}

//Hacky sleep to stop from hitting rate limit
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

main()
