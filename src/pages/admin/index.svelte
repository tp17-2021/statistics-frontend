<script lang="ts">

  import {authJWTToken} from "../../lib/api";
  import {authenticated, jwt} from "../../lib/stores";
  import {goto} from "@roxi/routify";

  let username, password;

  async function loginButton() {
    let bearer = await authJWTToken(username, password)
    if (bearer) {
        $authenticated = true
    } else {
        $authenticated = false
    }
  }

  function jwtChanged(newJwt: string) {
        if (newJwt) {
            $goto("/admin/home")
        }
    }

    $: jwtChanged($jwt)
</script>

<div class="pt-5">
  <div class="row">
    <div class="col-md-6 mx-auto">
      <h1 class="govuk-heading-l mb-5">
        Prihlásenie
      </h1>
      <div>
        <div class="govuk-form-group mb-3">
          <label class="govuk-label" for="name">
            Meno
          </label>
          <input class="govuk-input" id="name" name="name" type="text" bind:value={username}>
        </div>

        <div class="govuk-form-group mb-3">
          <label class="govuk-label" for="password">
            Heslo
          </label>
          <input class="govuk-input" id="password" name="password" type="password" bind:value={password}>
        </div>

        <button type="submit" class="idsk-button" data-module="idsk-button" on:click={() => loginButton()}>
          Prihlásiť
        </button>
      </div>
    </div>
  </div>
</div>