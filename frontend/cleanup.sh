echo "\e[96mCleanup Started: `date`\e[39m\e[49m"
# cleanup (region, prefix)
# cleanup () {
  stacks=$(aws cloudformation list-stacks --stack-status-filter CREATE_COMPLETE UPDATE_COMPLETE --query "StackSummaries[?starts_with(StackName, \`$2\`) == \`true\`].StackName" --output text --region $1)
  for stack in $stacks
  do
    echo "\e[90\e[4m${stack}:\e[0m \e[32mCleaning up change sets...\e[0m"
    changesets=$(aws cloudformation list-change-sets --stack-name $stack --query 'Summaries[?Status==`FAILED`].ChangeSetId' --output text --region $1)
    for changeset in $changesets
    do
      echo "\e[90\e[4m${stack}:\e[0m \e[31mDeleting change set \e[39m${changeset}\e[0m"
      aws cloudformation delete-change-set --change-set-name ${changeset} --region $1
    done
  done
# }
echo "\e[46mCleanup Done: `date`\e[39m\e[49m"
